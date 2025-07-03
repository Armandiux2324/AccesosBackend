import { Payment, Ticket, Visit, Visitor } from '../models/index.js';
import path from 'path';
import { Op, fn, col, literal } from 'sequelize';

export default {
  async save(req, res) {
    const { visit_id, payment_id, total } = req.body;
    let qr = 'Sin imagen';

    if (req.files && req.files.qr) {
      const file_path = req.files.qr.path;
      const file_name = path.basename(file_path);
      const ext = path.extname(file_name).toLowerCase();

      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        qr = file_name;
      }
    }

    try {
      await Ticket.create({ visit_id, payment_id, qr, total });
      return res.status(201).send({ message: 'Ticket creado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async update(req, res) {
    const { id, visit_id, payment_id, total } = req.body;

    try {
      const [updated] = await Ticket.update(
        { visit_id, total, payment_id },
        { where: { id } }
      );
      if (!updated) {
        return res.status(404).send({ message: 'Ticket no encontrado' });
      }
      return res.status(200).send({ message: 'Ticket actualizado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async delete(req, res) {
    const { id } = req.body;

    try {
      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).send({ message: 'Ticket no encontrado' });
      }

      const visitId = ticket.visit_id;

      await ticket.destroy();
      await Visit.destroy({ where: { id: visitId } });

      return res.status(200).send({ message: 'Ticket eliminado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getAll(req, res) {
    try {
      const tickets = await Ticket.findAll();
      return res.status(200).send({ data: tickets });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getOne(req, res) {
    const { id } = req.body;

    try {
      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).send({ message: 'Ticket no encontrado' });
      }
      return res.status(200).send({ data: ticket });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

   async getTotalSales(req, res) {
    try {
      const totalSales = await Ticket.sum('total');
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

      const salesInRange = await Ticket.sum('total', {
        include: [{
          model: Visit,
          as: 'visit',  
          required: true,
          where: {
            datetime_end: {
              [Op.between]: [startDate, endDate]
            }
          }
        }]
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

      const totalToday = await Ticket.sum('total', {
        include: [{
          model: Visit,
          as: 'visit',
          required: true,
          where: {
            datetime_end: {
              [Op.gte]: startOfDay,
              [Op.lt]:  startOfNextDay
            }
          }
        }]
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

        const sum = await Ticket.sum('total', {
          include: [{
            model: Visit,
            as: 'visit',
            required: true,
            where: {
              [Op.and]: [
                { datetime_begin: { [Op.gte]: dayStart } },
                { datetime_begin: { [Op.lt]:  dayEnd   } },
                literal('WEEKDAY(datetime_begin) NOT IN (0,6)')
              ]
            }
          }]
        });

        data.push(sum ?? 0);
      }

      return res.status(200).send({ labels, data });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getActiveVisitorsCount(req, res) {
    try {
      const activeTickets = await Ticket.findAll({
        where: { status: 'Activo' },
        attributes: ['visit_id']
      });
      const visitIds = activeTickets.map(t => t.visit_id);

      if (visitIds.length === 0) {
        return res.status(200).send({ count: 0 });
      }

      const count = await Visitor.count({
        where: {
          visit_id: { [Op.in]: visitIds }
        }
      });

      return res.status(200).send({ count });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async updateStatus(req, res) {
    const { id, status } = req.body;
    console.log(req)

    try {
      const [updated] = await Ticket.update(
        { status },
        { where: { id } }
      );
      if (!updated) {
        return res.status(404).send({ message: 'Ticket no encontrado para esa visita' });
      }
      return res.status(200).send({ message: 'Estado actualizado' });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },
};
