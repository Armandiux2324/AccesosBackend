import { sequelize, Ticket, Visit, Visitor } from '../models/index.js';
import path from 'path';
import { Op, QueryTypes } from 'sequelize';
import QRCode from 'qrcode';

export default {
  // Función para crear tickets
  async save(req, res) {
    // Recibe el visit_id y payment_id en el body
    const { visit_id, payment_id } = req.body;

    try {
      // Crear el ticket
      const ticket = await Ticket.create({ visit_id, payment_id });
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
    // Recibe el id, visit_id y payment_id en el body
    const { id, visit_id, payment_id } = req.body;

    try {
      const [updated] = await Ticket.update(
        { visit_id, payment_id },
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
      // Obtener el ticket y su visita
      const ticket = await Ticket.findByPk(id, {
        include: [{ model: Visit, as: 'visit' }]
      });
      if (!ticket) return res.status(404).send({ message: 'Ticket no encontrado' });

      // Actualizar el estado del ticket
      const [updated] = await Ticket.update({ status }, { where: { id } });
      if (!updated) return res.status(404).send({ message: 'No se pudo actualizar el ticket' });

      // Construir el objeto de actualización para Visit
      let visitUpdate = {};

      if (status === 'Activo') {
        // Inicio de visita
        visitUpdate = {
          datetime_begin: sequelize.literal('NOW()'),
          datetime_end:   null,
          duration_minutes: null
        };
      } else if (status === 'Inactivo') {
        // Fin de visita + duración calculada en SQL
        visitUpdate = {
          datetime_end: sequelize.literal('NOW()'),
          duration_minutes: sequelize.literal(
            "TIMESTAMPDIFF(MINUTE, datetime_begin, NOW())"
          )
        };
      } else {
        // Resetear fechas
        visitUpdate = {
          datetime_begin: null,
          datetime_end:   null,
          duration_minutes: null
        };
      }

      // Ejecutar la actualización de Visit
      const [visitUpdated] = await Visit.update(
        visitUpdate,
        { where: { id: ticket.visit_id } }
      );
      if (!visitUpdated) {
        return res.status(404).send({ message: 'Visita asociada no encontrada para actualizar fechas' });
      }

      return res.status(200).send({ message: 'Estado y fechas actualizadas' });
    } catch (err) {
      console.error('Error en updateStatus:', err);
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  // Función que se ejecutará al escanear tickets
  async scan(req, res) {
    const { ticket_id } = req.query;

    try {
      // Obtener ticket + visita
      const ticket = await Ticket.findByPk(ticket_id, {
        include: [{ model: Visit, as: 'visit' }]
      });
      if (!ticket) {
        return res.status(404).send({ message: 'Ticket no encontrado' });
      }

      // Contar visitantes
      const visitorsCount = await Visitor.count({
        where: { visit_id: ticket.visit_id }
      });

      // Determinar nuevo estado
      let newStatus = ticket.status;
      if (ticket.status === 'Sin iniciar')   newStatus = 'Activo';
      else if (ticket.status === 'Activo')    newStatus = 'Inactivo';
      else if (ticket.status === 'Inactivo')  return res.status(400).send({ message: 'Ticket inactivo' });

      // Actualizar estado en tickets
      if (newStatus !== ticket.status) {
        await ticket.update({ status: newStatus });
      }

      // Actualizar visit según el nuevo estado
      if (newStatus === 'Activo') {
        // Marcar inicio
        await Visit.update(
          { datetime_begin: sequelize.literal('NOW()') },
          { where: { id: ticket.visit_id } }
        );
      } else if (newStatus === 'Inactivo') {
        // Marcar fin + duración calculada en SQL
        await Visit.update(
          {
            datetime_end:     sequelize.literal('NOW()'),
            duration_minutes: sequelize.literal(
              `TIMESTAMPDIFF(MINUTE, datetime_begin, NOW())`
            )
          },
          { where: { id: ticket.visit_id } }
        );
      }

      return res.status(200).send({
        ticketId:      ticket.id,
        visitorsCount,
        newStatus
      });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

};
