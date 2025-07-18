import { Ticket, Visit, Visitor } from '../models/index.js';
import path from 'path';
import { Op } from 'sequelize';
import QRCode from 'qrcode';

export default {
  // Función para crear tickets
  async save(req, res) {
    // Recibe el visit_id, payment_id y discount en el body
    const { visit_id, payment_id, discount } = req.body;

    try {
      // Crear el ticket
      const ticket = await Ticket.create({ visit_id, payment_id, discount });
      const qrContent = `${ticket.id}`;

      // Ruta y nombre de archivo
      const filename = `qr_ticket_${ticket.id}.png`;
      const outputPath = path.resolve('uploads', 'qr', filename);

      // Generar el PNG
      await QRCode.toFile(outputPath, qrContent, {
        type: 'png',
        width: 300,
        margin: 2,
      });

      // Actualizar el ticket con la ruta del QR
      ticket.qr = filename;
      await ticket.save();

      return res.status(200).send({ message: 'Ticket creado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  // Función para actualizar tickets
  async update(req, res) {
    // Recibe el id, visit_id, payment_id y discount en el body
    const { id, visit_id, payment_id, discount } = req.body;

    try {
      const [updated] = await Ticket.update(
        { visit_id, payment_id, discount },
        { where: { id } }
      );
      if (!updated) {
        return res.status(404).send({ message: 'Ticket no encontrado' });
      }
      return res.status(200).send({ message: 'Ticket actualizado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  // Función para obtener todos los tickets
  async getAll(req, res) {
    try {
      const tickets = await Ticket.findAll();
      return res.status(200).send({ data: tickets });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  // Función para obtener el conteo de visitantes activos
  async getActiveVisitorsCount(req, res) {
    try {
      // Busca tickets activos y obtiene los visit_id
      const activeTickets = await Ticket.findAll({
        where: { status: 'Activo' },
        attributes: ['visit_id']
      });
      const visitIds = activeTickets.map(t => t.visit_id);

      if (visitIds.length === 0) {
        return res.status(200).send({ count: 0 });
      }

      // Cuenta los visitantes asociados a esos visit_id
      const count = await Visitor.count({
        where: {
          visit_id: { [Op.in]: visitIds }
        }
      });

      return res.status(200).send({ count });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  // Función para actualizar el estado de un ticket
  async updateStatus(req, res) {
    const { id, status } = req.body;

    try {
      // Obtener el ticket para sacar el visit_id
      const ticket = await Ticket.findOne(
        { where: { id }, include: [{ model: Visit, as: 'visit' }] }
      );
      if (!ticket) {
        return res.status(404).send({ message: 'Ticket no encontrado' });
      }

      // Actualizar el estado en tickets
      const [updated] = await Ticket.update(
        { status: status },
        { where: { id } }
      );
      if (!updated) {
        return res.status(404).send({ message: 'No se pudo actualizar el ticket' });
      }

      // Preparar los campos de fecha para visits
      const visitUpdate = {};
      const now = new Date();
      // Actualizar las fechas según el estado
      if (status == 'Activo') {
        visitUpdate.datetime_begin = now;
        visitUpdate.datetime_end = null;
        visitUpdate.duration_minutes = null;
      } else if (status == 'Inactivo') {
        visitUpdate.datetime_end = now;
        if (!ticket.visit.datetime_begin) {
          return res.status(400).send({ message: 'Fecha de inicio no establecida para la visita' });
        }
      } else {
        visitUpdate.datetime_begin = null;
        visitUpdate.datetime_end = null;
        visitUpdate.duration_minutes = null;
      }
      
      const [visitUpdated] = await Visit.update(
        visitUpdate,
        { where: { id: ticket.visit_id } }
      );
      if (!visitUpdated) {
        return res.status(404).send({ message: 'Visita asociada no encontrada para actualizar fechas' });
      }

      return res.status(200).send({ message: 'Estado y fechas actualizadas' });

    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  // Función para que se ejecutará al escanear tickets
  async scan(req, res) {
    const { ticket_id } = req.query;

    try {
      // Búsqueda del ticket
      const ticket = await Ticket.findOne(
        { where: { id: ticket_id }, include: [{ model: Visit, as: 'visit' }] }
      );
      if (!ticket) {
        return res.status(404).send({ message: 'Ticket no encontrado' });
      }

      // Conteo de visitantes de la visita asociada
      const visitorsCount = await Visitor.count({
        where: { visit_id: ticket.visit_id }
      });

      // Aplicar nuevo estado
      let newStatus = ticket.status;
      if (ticket.status === 'Sin iniciar') {
        newStatus = 'Activo';
      } else if (ticket.status === 'Activo') {
        newStatus = 'Inactivo';
      } else if (ticket.status === 'Inactivo') {
        return res.status(404).send({ message: 'Ticket inactivo' });
      }

      if (newStatus !== ticket.status) {
        ticket.status = newStatus;
        await ticket.save();
      }

      // Actualizar fecha de inicio de la visita
      if (newStatus === 'Activo') {
        const visit = await Visit.findByPk(ticket.visit_id);
        if (visit) {
          visit.datetime_begin = new Date();
          await visit.save();
        }
      } else if (newStatus === 'Inactivo') {
        const visit = await Visit.findByPk(ticket.visit_id);
        if (visit) {
          visit.datetime_end = new Date();
          // Cálculo de duración
          const datetimeBegin = new Date(visit.datetime_begin);
          const datetimeEnd = new Date(visit.datetime_end);
          if (datetimeEnd < datetimeBegin) {
            return res.status(400).send({ message: 'La fecha de fin debe ser posterior a la de inicio' });
          }
          const differenceMs = datetimeEnd - datetimeBegin;

          visit.duration_minutes = Math.round(differenceMs / 60000);
          await visit.save();
        }
      }

      return res.status(200).send({
        ticketId: ticket.id,
        visitorsCount,
        newStatus
      });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },
};
