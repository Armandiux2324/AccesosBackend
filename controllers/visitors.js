import { Visitor, Visit, Price } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

export default {
  async save(req, res) {
    const { age, gender, school, township, unit_price, visit_id } = req.body;

    try {
      await Visitor.create({ age, gender, school, township, unit_price, visit_id });
      return res.status(201).send({ message: 'Visitante agregado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async update(req, res) {
    const { id, age, gender, school, township, unit_price, visit_id } = req.body;

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
    const { id } = req.query;

    try {
      const visitor = await Visitor.findByPk(id);
      if (!visitor) {
        return res.status(404).send({ message: 'Visitante no encontrado' });
      }
      return res.status(200).send({ data: visitor });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getByVisitId(req, res) {
    try {
      const {visit_id} = req.query;
      const visitors = await Visitor.findAll({
        where: { visit_id },
        include: [{
          model: Price,
          as: 'price',
          attributes: ['type', 'price']
        }]
      });

      if (visitors.length === 0) {
        return res.status(404).send({ message: 'No se encontraron visitantes para esa visita' });
      }

      return res.status(200).send({ data: visitors });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getTodayCount(req, res) {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const startOfNextDay = new Date(startOfDay);
      startOfNextDay.setDate(startOfDay.getDate() + 1);

      const count = await Visitor.count({
        include: [{
          model: Visit,
          required: true,
          where: {
            datetime_end: {
              [Op.gte]: startOfDay,
              [Op.lt]: startOfNextDay
            }
          }
        }]
      });

      return res.status(200).send({ todayCount: count });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  async getDailyVisitors(req, res) {
    try {
      const { from, to } = req.body;
      const startDate = new Date(String(from));
      const endDate = new Date(String(to));

      const data = await Visitor.findAll({
        include: [{
          model: Visit,
          required: true,
          where: {
            [Op.and]: [
              { datetime_begin: { [Op.between]: [startDate, endDate] } },
              literal('WEEKDAY(datetime_begin) NOT IN (5,6)')
            ]
          },
          attributes: []
        }],
        attributes: [
          [fn('DATE', col('visit.datetime_begin')), 'date'],
          [fn('COUNT', col('visitor.id')), 'count']
        ],
        group: [fn('DATE', col('visit.datetime_begin'))],
        order: [[fn('DATE', col('visit.datetime_begin')), 'ASC']]
      });

      const countsMap = {};
      data.forEach(item => {
        const date = item.getDataValue('date');
        countsMap[date] = parseInt(item.getDataValue('count'), 10);
      });

      const result = [];
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const wd = d.getDay(); 
        if (wd === 0 || wd === 6) continue;
        const iso = d.toISOString().slice(0, 10);
        result.push({ date: iso, count: countsMap[iso] || 0 });
      }

      return res.status(200).send({ data: result });
    } catch (error) {
      return res.status(500).send({ message: 'Error obteniendo visitantes diarios' });
    }
  },

  async getVisitorsByPriceTypeTotal(req, res) {
    try {
      const data = await Visitor.findAll({
        include: [{
          model: Price,
          as: 'price',
          attributes: []
        }],
        attributes: [
          [col('price.type'), 'ticketType'],
          [fn('COUNT', col('Visitor.id')), 'count']
        ],
        group: [col('price.type')]
      });

      const result = data.map(item => ({
        ticketType: item.getDataValue('ticketType'),
        count: parseInt(item.getDataValue('count'), 10)
      }));

      return res.status(200).send({ data: result });
    } catch (error) {
      return res.status(500).send({ message: 'Error obteniendo visitantes por tipo de boleto (prices)' });
    }
  },

  async getVisitorsByGenderTotal(req, res) {
    try {
      const data = await Visitor.findAll({
        attributes: [
          'gender',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['gender']
      });

      const result = data.map(item => ({
        gender: item.getDataValue('gender'),
        count: parseInt(item.getDataValue('count'), 10)
      }));

      return res.status(200).send({ data: result });
    } catch (error) {
      return res.status(500).send({ message: 'Error obteniendo visitantes por género' });
    }
  },

  async getVisitorsByAgeGroupTotal(req, res) {
    try {
      const caseExpr = `
        CASE
          WHEN age BETWEEN 0 AND 10 THEN '0-10'
          WHEN age BETWEEN 11 AND 20 THEN '11-20'
          WHEN age BETWEEN 21 AND 30 THEN '21-30'
          WHEN age BETWEEN 31 AND 40 THEN '31-40'
          WHEN age BETWEEN 41 AND 50 THEN '41-50'
          WHEN age BETWEEN 51 AND 60 THEN '51-60'
          ELSE '60+'
        END
      `;

      const data = await Visitor.findAll({
        attributes: [
          [literal(caseExpr), 'ageGroup'],
          [fn('COUNT', col('id')), 'count']
        ],
        group: [literal('ageGroup')]
      });

      const result = data.map(item => ({
        ageGroup: item.getDataValue('ageGroup'),
        count: parseInt(item.getDataValue('count'), 10)
      }));

      return res.status(200).send({ data: result });
    } catch (error) {
      return res.status(500).send({ message: 'Error obteniendo visitantes por grupo de edad' });
    }
  }
};
