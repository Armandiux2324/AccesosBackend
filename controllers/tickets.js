import { Ticket, Visit, Visitor } from '../models/index.js';
import path from 'path';
import { Op } from 'sequelize';
import QRCode from 'qrcode';
import { date } from 'yup';

export default {
  async save(req, res) {
    const { visit_id, payment_id, discount } = req.body;

    try {
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

      ticket.qr = filename;
      await ticket.save();

      return res.status(200).send({ message: 'Ticket creado' });
    } catch (err) {
      console.error('Error al crear ticket con QR:', err);
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async update(req, res) {
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

  async delete(req, res) {
    const { id } = req.body;

    try {
      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).send({ message: 'Ticket no encontrado' });
      }

      const visitId = ticket.visit_id;

      await ticket.destroy();
      await Visit.destroy({ where: { id: visitId } });

      return res.status(200).send({ message: 'Ticket eliminado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getAll(req, res) {
    try {
      const tickets = await Ticket.findAll();
      return res.status(200).send({ data: tickets });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getOne(req, res) {
    const { id } = req.body;

    try {
      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).send({ message: 'Ticket no encontrado' });
      }
      return res.status(200).send({ data: ticket });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getActiveVisitorsCount(req, res) {
    try {
      const activeTickets = await Ticket.findAll({
        where: { status: 'Activo' },
        attributes: ['visit_id']
      });
      const visitIds = activeTickets.map(t => t.visit_id);

      if (visitIds.length === 0) {
        return res.status(200).send({ count: 0 });
      }

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

  async updateStatus(req, res) {
    const { id, status } = req.body;

    try {
      // 1) Obtener el ticket para conocer el visit_id
      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).send({ message: 'Ticket no encontrado' });
      }

      // 2) Actualizar solo el estado en tickets
      const [updated] = await Ticket.update(
        { status: status },
        { where: { id } }
      );
      if (!updated) {
        return res.status(404).send({ message: 'No se pudo actualizar el ticket' });
      }

      // 3) Preparar los campos de fecha para visits
      const visitUpdate = {};
      const now = new Date();
      if (status == 'Activo') {
        visitUpdate.datetime_begin = now;
        visitUpdate.datetime_end = null;
      } else if (status == 'Inactivo') {
        visitUpdate.datetime_end = now;
        if (!ticket.datetime_begin) {
          return res.status(400).send({ message: 'Fecha de inicio no establecida para la visita' });
        }
      } else {
        visitUpdate.datetime_begin = null;
        visitUpdate.datetime_end = null;
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
      console.error('Error al actualizar estado:', err);
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async scan(req, res) {
    const { ticket_id } = req.query;
    if (!ticket_id) {
      return res.status(400).send({ message: 'Falta ticketId' });
    }

    try {
      // Búsqueda del ticket
      const ticket = await Ticket.findByPk(ticket_id);
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
      console.error('Error en scan de ticket:', err);
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },
};
