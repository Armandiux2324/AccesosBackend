import { Payment, Price, Ticket, Visit, Visitor } from '../models/index.js';
import { Op, fn, col, Sequelize } from 'sequelize';

export default {
  async updateDatetimeEnd(req, res) {
    const { id, datetime_end } = req.body;

    try {
      const visit = await Visit.findByPk(id);
      if (!visit) {
        return res.status(404).send({ message: 'Visita no encontrada' });
      }

      // Cálculo de duración
      const datetimeBegin = new Date(visit.datetime_begin);
      const datetimeEnd = new Date(datetime_end);
      if (datetimeEnd < datetimeBegin) {
        return res.status(400).send({ message: 'La fecha de fin debe ser posterior a la de inicio' });
      }
      const differenceMs = datetimeEnd - datetimeBegin;
      const duration_minutes = Math.round(differenceMs / 60000);

      await visit.update({ datetime_end, duration_minutes });

      return res.status(200).send({ message: 'Fecha de fin y duración actualizadas', duration_minutes });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async save(req, res) {
    const { contact, datetime_begin } = req.body;

    try {
      await Visit.create({ contact, datetime_begin });
      return res.status(201).send({ message: 'Visita agregada' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async update(req, res) {
    const { id, contact, datetime_begin, datetime_end, duration_minutes } = req.body;

    try {
      const [updated] = await Visit.update(
        { contact, datetime_begin, datetime_end, duration_minutes },
        { where: { id } }
      );
      if (!updated) {
        return res.status(404).send({ message: 'Visita no encontrada' });
      }
      return res.status(200).send({ message: 'Visita actualizada' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

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

  async getOne(req, res) {
    const { id } = req.query;

    try {
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
      console.error(err);
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getVisitsPaginated(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 20;
      const offset = (page - 1) * size;

      const { count, rows } = await Visit.findAndCountAll({
        include: [{
          model: Ticket,
          as: 'ticket'
        }],
        limit: size,
        offset: offset,
        order: [['datetime_begin', 'DESC']]
      });

      return res.status(200).send({
        data: rows,
        total: count,
        page,
        size,
        totalPages: Math.ceil(count / size)
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async searchVisitsPaginated(req, res) {
    try {
      const { date, page = '1', size = '20' } = req.query;

      const pageNum = parseInt(page, 10);
      const pageSize = parseInt(size, 10);
      const offset = (pageNum - 1) * pageSize;

      const where = Sequelize.where(
        fn('DATE', col('datetime_begin')), date
      );

      const { count, rows } = await Visit.findAndCountAll({
        where,
        include: [{
          model: Ticket,
          as: 'ticket'
        }],
        order: [['datetime_begin', 'DESC']],
        limit:  pageSize,
        offset: offset
      });

      return res.status(200).send({
        data:       rows,
        total:      count,
        page:       pageNum,
        size:       pageSize,
        totalPages: Math.ceil(count / pageSize)
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

};
