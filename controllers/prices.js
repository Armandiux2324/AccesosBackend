import { Price } from '../models/index.js';

export default {
  async save(req, res) {
    const { type, price } = req.body;

    if (!['Administrador','Directora'].includes(req.user.role)) {
      return res.status(403).send({ message: 'No tienes permisos para realizar esta operación.' });
    }

    try {
      await Price.create({ type, price });
      return res.status(201).send({ message: 'Precio creado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async update(req, res) {
    const { id, type, price } = req.body;

    if (!['Administrador','Directora'].includes(req.user.role)) {
      return res.status(403).send({ message: 'No tienes permisos para realizar esta operación.' });
    }

    try {
      const [updated] = await Price.update(
        { type, price },
        { where: { id } }
      );
      if (!updated) {
        return res.status(404).send({ message: 'Precio no encontrado' });
      }
      return res.status(200).send({ message: 'Precio modificado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async delete(req, res) {
    const { id } = req.body;

    if (!['Administrador','Directora'].includes(req.user.role)) {
      return res.status(403).send({ message: 'No tienes permisos para realizar esta operación.' });
    }

    try {
      const deleted = await Price.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).send({ message: 'Precio no encontrado' });
      }
      return res.status(200).send({ message: 'Precio eliminado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getAll(req, res) {
    try {
      const prices = await Price.findAll();
      return res.status(200).send({ data: prices });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getOne(req, res) {
    const { id } = req.body;
    
    try {
      const price = await Price.findByPk(id);
      return res.status(200).send({ data: price });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  }
};
