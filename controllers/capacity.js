import { Capacity } from '../models/index.js';

export default {
  async save(req, res) {
    const { capacity } = req.body;

    if (!['Administrador','Directora'].includes(req.user.role)) {
      return res.status(403).send({ message: 'No tienes permisos para realizar esta operación.' });
    }

    try {
      await Capacity.create({ capacity });
      return res.status(201).send({ message: 'Capacidad definida' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async update(req, res) {
    const { id, capacity } = req.body;
    if (!['Administrador','Directora'].includes(req.user.role)) {
      return res.status(403).send({ message: 'No tienes permisos para realizar esta operación.' });
    }

    try {
      const [updated] = await Capacity.update(
        { capacity },
        { where: { id } }
      );
      if (!updated) {
        return res.status(404).send({ message: 'Capacidad no encontrada' });
      }
      return res.status(200).send({ message: 'Capacidad actualizada' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async get(req, res) {
    if (!['Administrador','Directora'].includes(req.user.role)) {
      return res.status(403).send({ message: 'No tienes permisos para realizar esta operación.' });
    }

    try {
      const limit = await Capacity.findByPk(1);
      if (!limit) {
        return res.status(404).send({ message: 'Capacidad no encontrada' });
      }
      return res.status(200).send({ data: limit });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  }
};
