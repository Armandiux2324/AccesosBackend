import { Price } from '../models/index.js';

export default {

  // Función para actualizar todos los precios
  async updateMany(req, res) {
    const { updates } = req.body;
    if (!['Administrador', 'Director'].includes(req.user.role)) {
      return res.status(403).send({ message: 'No tienes permisos.' });
    }
    // Verifica que se envíe una lista de actualizaciones
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).send({ message: 'Enviar lista de actualizaciones.' });
    }

    try {
      // Actualiza cada precio en la lista de actualizaciones
      await Promise.all(
        updates.map(u =>
          Price.update(
            { price: u.price },
            { where: { id: u.id } }
          )
        )
      );
      return res.status(200).send({ message: 'Precios actualizados.' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  // Función obtener todos los precios
  async getAll(req, res) {
    try {
      const prices = await Price.findAll();
      return res.status(200).send({ data: prices });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },
};
