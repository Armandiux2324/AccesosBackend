import { Payment } from '../models/index.js';

export default {
  async save(req, res) {
    const { reference, payment_type } = req.body;
    if (!payment_type) {
      return res.status(400).send({ message: 'Rellena todos los campos' });
    }
    try {
      await Payment.create({ reference, payment_type });
      return res.status(201).send({ message: 'Pago agregado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async update(req, res) {
    const { id, reference, payment_type } = req.body;
    if (!id) {
      return res.status(400).send({ message: 'Falta el ID del pago' });
    }
    if (!payment_type) {
      return res.status(400).send({ message: 'Rellena todos los campos' });
    }
    try {
      const [updated] = await Payment.update(
        { reference, payment_type },
        { where: { id } }
      );
      if (!updated) {
        return res.status(404).send({ message: 'Pago no encontrado' });
      }
      return res.status(200).send({ message: 'Pago actualizado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async delete(req, res) {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({ message: 'Falta el ID del pago' });
    }
    try {
      const deleted = await Payment.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).send({ message: 'Pago no encontrado' });
      }
      return res.status(200).send({ message: 'Pago eliminado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getAll(req, res) {
    try {
      const payments = await Payment.findAll();
      return res.status(200).send({ data: payments });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getOne(req, res) {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({ message: 'Falta el ID del pago' });
    }
    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        return res.status(404).send({ message: 'Pago no encontrado' });
      }
      return res.status(200).send({ data: payment });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  }
};
