import { Settings } from '../models/index.js';

export default {
  async save(req, res) {
    const { capacity, companion_dicount } = req.body;

    if (!['Administrador','Directora'].includes(req.user.role)) {
      return res.status(403).send({ message: 'No tienes permisos para realizar esta operación.' });
    }

    try {
      await Settings.create({ capacity, companion_dicount });
      return res.status(201).send({ message: 'Capacidad y descuento de acompañante definidos' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async update(req, res) {
    console.log(req)
    const { id, capacity, companion_discount } = req.body;
    if (!['Administrador','Directora'].includes(req.user.role)) {
      return res.status(403).send({ message: 'No tienes permisos para realizar esta operación.' });
    }

    try {
      const [updated] = await Settings.update(
        { capacity, companion_discount },
        { where: { id } }
      );
      if (!updated) {
        return res.status(404).send({ message: 'Configuraciones no encontradas' });
      }
      return res.status(200).send({ message: 'Capacidad y descuento de acompañantes actualizados' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async get(req, res) {
    if (!['Administrador','Directora'].includes(req.user.role)) {
      return res.status(403).send({ message: 'No tienes permisos para realizar esta operación.' });
    }

    try {
      const settings = await Settings.findByPk(1);
      if (!settings) {
        return res.status(404).send({ message: 'Configuraciones no encontradas' });
      }
      return res.status(200).send({ data: settings });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  }
};
