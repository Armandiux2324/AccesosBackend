import { Payment, Ticket } from '../models/index.js';
import { Op, fn, col, Sequelize, literal } from 'sequelize';

export default {
  async save(req, res) {
    const { reference, payment_type, total } = req.body;

    try {
      const payment = await Payment.create({ reference, payment_type, total });
      return res.status(201).send({ message: 'Pago agregado', data: payment });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async update(req, res) {
    const { id, reference, payment_type } = req.body;

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
    const { id } = req.query;

    try {
      const deleted = await Payment.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).send({ message: 'Pago no encontrado' });
      }
      return res.status(200).send({ message: 'Pago eliminado' });
    } catch (err) {
      console.error(err);
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

    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        return res.status(404).send({ message: 'Pago no encontrado' });
      }
      return res.status(200).send({ data: payment });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

   async getTotalSales(req, res) {
      try {
        const totalSales = await Payment.sum('total');
        return res.status(200).send({ totalSales: totalSales ?? 0 });
      } catch (err) {
        return res.status(500).send({ message: 'Intenta más tarde' });
      }
    },
  
    async getSalesInDateRange(req, res) {
      try {
        const { from, to } = req.body;
        const startDate = new Date(String(from));
        const endDate = new Date(String(to));
  
        const salesInRange = await Payment.sum('total', {
          where: {
            payment_date: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          }
        });
        return res.status(200).send({ salesInRange: salesInRange ?? 0 });
      } catch (err) {
        return res.status(500).send({ message: 'Intenta más tarde' });
      }
    },
  
    async getTodaySales(req, res) {
      try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const startOfNextDay = new Date(startOfDay);
        startOfNextDay.setDate(startOfDay.getDate() + 1);
  
        const totalToday = await Payment.sum('total', {
          where: {
            payment_date: {
              [Op.gte]: startOfDay,
              [Op.lt]: startOfNextDay
            }
          }
        });
  
        return res.status(200).send({ totalToday: totalToday ?? 0 });
      } catch (err) {
        return res.status(500).send({ message: 'Intenta más tarde' });
      }
    },
  
    async getLast7DaysSales(req, res) {
      try {
        const today = new Date();
        today.setHours(0,0,0,0);
  
        const labels = [];
        const data = [];
  
        for (let i = 6; i >= 0; i--) {
          const dayStart = new Date(today);
          dayStart.setDate(today.getDate() - i);
  
          const dayEnd = new Date(dayStart);
          dayEnd.setDate(dayStart.getDate() + 1);
  
          const wd = dayStart.getDay();
          if (wd === 0 || wd === 1) {
            continue;
          }
  
          const label = dayStart.toISOString().slice(0,10);
          labels.push(label);
  
          const sum = await Payment.sum('total', {
            where: {
              [Op.and]: [
                { payment_date: { [Op.gte]: dayStart } },
                { payment_date: { [Op.lt]:  dayEnd   } },
                literal('WEEKDAY(payment_date) NOT IN (0,6)')
              ]
            }
          });
  
          data.push(sum ?? 0);
        }
  
        return res.status(200).send({ labels, data });
      } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Intenta más tarde' });
      }
    },
};
