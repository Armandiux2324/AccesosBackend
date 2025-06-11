import { Ticket } from '../models/index.js';
import path from 'path';

export default {
  async save(req, res) {
    console.log(req)
    const { visit_id, payment_id, total } = req.body;
    let qr = 'Sin imagen';

    if (!visit_id || !payment_id || total == null) {
      return res.status(400).send({ message: 'Rellena todos los campos' });
    }

    if (req.files && req.files.qr) {
      const file_path = req.files.qr.path;
      const file_name = path.basename(file_path);
      const ext = path.extname(file_name).toLowerCase();

      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        qr = file_name;
      }
    }

    try {
      await Ticket.create({ visit_id, payment_id, qr, total });
      return res.status(201).send({ message: 'Ticket creado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async update(req, res) {
    const { id, visit_id, payment_id, total } = req.body;
    if (!id || !visit_id || !payment_id || total == null) {
      return res.status(400).send({ message: 'Rellena todos los campos' });
    }

    try {
      const [updated] = await Ticket.update(
        { visit_id, total, payment_id },
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
    if (!id) {
      return res.status(400).send({ message: 'Falta el ID del ticket' });
    }

    try {
      const deleted = await Ticket.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).send({ message: 'Ticket no encontrado' });
      }
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
    if (!id) {
      return res.status(400).send({ message: 'Falta el ID del ticket' });
    }

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

   async getTotalSales(req, res) {
    try {
      const totalSales = await Ticket.sum('total');
      return res.status(200).send({ totalSales: totalSales ?? 0 });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  }
};
