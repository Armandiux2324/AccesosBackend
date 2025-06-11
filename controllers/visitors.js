import { Visitor } from '../models/index.js';

export default {
  async save(req, res) {
    const { age, gender, school, township, unit_price, visit_id } = req.body;
    if (
      age == null ||
      !gender ||
      !school ||
      township == null ||
      unit_price == null ||
      visit_id == null
    ) {
      return res.status(400).send({ message: 'Rellena todos los campos' });
    }
    try {
      await Visitor.create({ age, gender, school, township, unit_price, visit_id });
      return res.status(201).send({ message: 'Visitante agregado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async update(req, res) {
    const { id, age, gender, school, township, unit_price, visit_id } = req.body;
    if (
      id == null ||
      age == null ||
      !gender ||
      !school ||
      township == null ||
      unit_price == null ||
      visit_id == null
    ) {
      return res.status(400).send({ message: 'Rellena todos los campos' });
    }
    try {
      const [updated] = await Visitor.update(
        { age, gender, school, township, unit_price, visit_id },
        { where: { id } }
      );
      if (!updated) {
        return res.status(404).send({ message: 'Visitante no encontrado' });
      }
      return res.status(200).send({ message: 'Visitante modificado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async delete(req, res) {
    const { id } = req.body;
    if (id == null) {
      return res.status(400).send({ message: 'Falta el ID del visitante' });
    }
    try {
      const deleted = await Visitor.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).send({ message: 'Visitante no encontrado' });
      }
      return res.status(200).send({ message: 'Visitante eliminado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getAll(req, res) {
    try {
      const visitors = await Visitor.findAll();
      return res.status(200).send({ data: visitors });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getOne(req, res) {
    const { id } = req.body;
    if (id == null) {
      return res.status(400).send({ message: 'Falta el ID del visitante' });
    }
    try {
      const visitor = await Visitor.findByPk(id);
      if (!visitor) {
        return res.status(404).send({ message: 'Visitante no encontrado' });
      }
      return res.status(200).send({ data: visitor });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  }
};
