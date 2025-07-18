import { Settings } from '../models/index.js';

export default {
  // Función para guardar configuraciones (capacidad y descuento de acompañantes)
  async save(req, res) {
    // Recibe la capacidad y el descuento de acompañantes en el body
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

  // Función para actualizar configuraciones (capacidad y descuento de acompañantes)
  async update(req, res) {
    // Recibe el id, capacidad y descuento de acompañantes en el body
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

  // Función para obtener el registro de configuraciones
  async getOne(req, res) {
    try {
      // Busca las configuraciones por id (Único registro)
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
