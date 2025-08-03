import { Payment, Price, Ticket, Visit, Visitor } from '../models/index.js';
import { Op, fn, col, Sequelize } from 'sequelize';

export default {
  // Función para agregar una nueva visita
  async save(req, res) {
    // Recibir los datos de la visita
    const { contact, school, township } = req.body;

    try {
      const visit = await Visit.create({ contact, school, township });
      return res.status(201).send({message: 'Visita agregada', data: visit});
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  // Función para eliminar una visita
  async delete(req, res) {
    const { id } = req.query;

    try {
      const deleted = await Visit.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).send({ message: 'Visita no encontrada' });
      }
      return res.status(200).send({ message: 'Visita eliminada' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  // Función para obtener una visita por ID
  async getOne(req, res) {
    const { id } = req.query;

    try {
      // Buscar la visita por ID e incluir los visitantes y el ticket
      const visit = await Visit.findOne({
        where: { id },
        include: [
          {
            model: Visitor,
            as: 'visitors',
            include: [
              {
                model: Price,
                as: 'price'
              }
            ]
          },
          {
            model: Ticket,
            as: 'ticket',
            include: [
              {
                model: Payment,
                as: 'payment'
              }
            ]
          }
        ]
      });
      if (!visit) {
        return res.status(404).send({ message: 'Visita no encontrada' });
      }
      return res.status(200).send({ data: visit });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  // Función para obtener todas las visitas paginadas 
  async getAll(req, res) {
    try {
      // Obtener los parámetros de paginación
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 20;
      const offset = (page - 1) * size;

      // Consultar las visitas con paginación
      const { count, rows } = await Visit.findAndCountAll({
        distinct: true,
        col: 'id',
        include: [
          {
            model: Ticket,
            as: 'ticket',
            include: [{
              model: Payment,
              as: 'payment'
            }],
          },
          {
            model: Visitor,
            as: 'visitors',
            include: [{
              model: Price,
              as: 'price'
            }]
          }
        ],
        limit: size,
        offset: offset,
        order: [['created_at', 'DESC']]
      });

      return res.status(200).send({
        data: rows,
        total: count,
        page,
        size,
        totalPages: Math.ceil(count / size)
      });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  // Función para buscar visitas por fecha paginadas
  async searchVisits(req, res) {
    try {
      const { date, page = '1', size = '20' } = req.query;

      // Establecer parámetros de paginación
      const pageNum = parseInt(page, 10);
      const pageSize = parseInt(size, 10);
      const offset = (pageNum - 1) * pageSize;

      const where = Sequelize.where(
        fn('DATE', col('created_at')), date
      );

      // Consultar las visitas filtradas por fecha y paginadas
      const { count, rows } = await Visit.findAndCountAll({
        distinct: true,
        col: 'id',
        where,
        include: [
          {
            model: Ticket,
            as: 'ticket',
            include: [{
              model: Payment,
              as: 'payment'
            }],
          },
          {
            model: Visitor,
            as: 'visitors',
            include: [{
              model: Price,
              as: 'price'
            }]
          }
        ],
        order: [['created_at', 'DESC']],
        limit: pageSize,
        offset: offset
      });

      return res.status(200).send({
        data: rows,
        total: count,
        page: pageNum,
        size: pageSize,
        totalPages: Math.ceil(count / pageSize)
      });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  }

};
