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
      const datetimeEnd   = new Date(datetime_end);
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

  async getAll(req, res) {
    try {
      const visits = await Visit.findAll({
        include: [
        {
          model: Ticket,
          as: 'ticket'
        }
      ]
      });
      return res.status(200).send({ data: visits });
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

  async getVisitByDate(req, res) {
      try {
        const parameter = req.query.parameter;
        if (!parameter) {
          return res.status(400).send({ message: 'Parámetro requerido' });
        }
  
        const visits = await Visit.findAll({
          where: Sequelize.where(
            fn('DATE', col('datetime_begin')),
            parameter
          ),
          order: [['datetime_begin', 'DESC']]
        });
  
        return res.status(200).send({ data: visits });
      } catch (err) {
        return res.status(500).send({ message: 'Intenta más tarde' });
      }
    }
};
