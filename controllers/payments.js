import { Payment } from '../models/index.js';
import { Op, literal } from 'sequelize';

export default {
  // Función para crear pagos
  async save(req, res) {
    //Recibe el efectivo, tarjeta y cheque y el total en el body
    const { total, cash, card, payment_check } = req.body;

    try {
      const payment = await Payment.create({ total, cash, card, payment_check });
      return res.status(201).send({ message: 'Pago agregado', data: payment });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  // Funciones para obtener estadísticas de ventas

  //Función para obtener el total de ventas
  async getTotalSales(req, res) {
    try {
      const totalSales = await Payment.sum('total');
      return res.status(200).send({ totalSales: totalSales ?? 0 });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  //Función para obtener las ventas en un rango de fechas
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

  // Función para obtener ventas del día actual
  async getTodaySales(req, res) {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const startOfNextDay = new Date(startOfDay);
      startOfNextDay.setDate(startOfDay.getDate() + 1);

      //Suma las ventas cuya fecha de pago sea hoy
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

  // Función para obtener las ventas de los últimos 7 días
  async getLast7DaysSales(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

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

        const label = dayStart.toISOString().slice(0, 10);
        labels.push(label);

        // Suma las ventas del día, excluyendo domingo y lunes
        const sum = await Payment.sum('total', {
          where: {
            [Op.and]: [
              { payment_date: { [Op.gte]: dayStart } },
              { payment_date: { [Op.lt]: dayEnd } },
              literal('WEEKDAY(payment_date) NOT IN (0,6)')
            ]
          }
        });

        data.push(sum ?? 0);
      }

      return res.status(200).send({ labels, data });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },
};
