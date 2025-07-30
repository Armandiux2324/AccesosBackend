import { Visitor, Visit, Price } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

export default {
  // Función para agregar un nuevo visitante
  async save(req, res) {
    // Recibir los datos del visitante
    const { gender, price_id, visit_id } = req.body;

    if (!['Taquilla'].includes(req.user.role)) {
        return res.status(403).send({ message: 'Acceso denegado' });
    }

    try {
      await Visitor.create({ gender, price_id, visit_id });
      return res.status(201).send({ message: 'Visitante agregado' });
    } catch (err) {
      return res.status(500).send({ message: 'Intenta más tarde' });
    }
  },

  // Función para contar los visitantes del día actual
  async getTodayCount(req, res) {
    try {
      // Obtener el inicio del día actual y el inicio del siguiente día
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const startOfNextDay = new Date(startOfDay);
      startOfNextDay.setDate(startOfDay.getDate() + 1);

      // Contar los visitantes que tienen una visita creada hoy
      const count = await Visitor.count({
        include: [{
          model: Visit,
          as: 'visit',
          required: true,
          where: {
            created_at: {
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

  // Función para obtener los visitantes diarios en un rango de fechas
  async getDailyVisitorsInDateRange(req, res) {
    try {
      const { from, to } = req.body;
      // Establecer las fechas de inicio y fin
      const startDate = new Date(String(from));
      const endDate = new Date(String(to));

      // Consultar los visitantes cuya visita se creó en el rango de fechas
      const data = await Visitor.findAll({
        include: [{
          model: Visit,
          as: 'visit',
          required: true,
          where: {
            [Op.and]: [
              { created_at: { [Op.between]: [startDate, endDate] } },
              literal('WEEKDAY(created_at) NOT IN (0,6)')
            ]
          },
          attributes: []
        }],

        // Agrupar por fecha de creación de la visita
        attributes: [
          [fn('DATE', col('visit.created_at')), 'date'],
          [fn('COUNT', col('visitor.id')), 'count']
        ],
        group: [fn('DATE', col('visit.created_at'))],
        order: [[fn('DATE', col('visit.created_at')), 'ASC']]
      });

      // Mapear los resultados en formato para las estadísticas
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

  // Función para obtener el total de visitantes por tipo de boleto
  async getVisitorsByPriceTypeTotal(req, res) {
    if (!['Administrador', 'Directora'].includes(req.user.role)) {
        return res.status(403).send({ message: 'Acceso denegado' });
    }
    try {
      // Agrupar los visitantes por tipo de boleto y contar
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

      // Mapear los resultados en formato para las estadísticas
      const result = data.map(item => ({
        ticketType: item.getDataValue('ticketType'),
        count: parseInt(item.getDataValue('count'), 10)
      }));

      return res.status(200).send({ data: result });
    } catch (error) {
      return res.status(500).send({ message: 'Error obteniendo visitantes por tipo de boleto (prices)' });
    }
  },

  // Función para obtener el total de visitantes por género
  async getVisitorsByGenderTotal(req, res) {
    if (!['Administrador', 'Directora'].includes(req.user.role)) {
        return res.status(403).send({ message: 'Acceso denegado' });
    }
    try {
      // Agrupar los visitantes por género y contar
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

  // Función para obtener los visitantes agrupados por municipio
  async getVisitorsByTownship(req, res) {
    if (!['Administrador', 'Directora'].includes(req.user.role)) {
      return res.status(403).send({ message: 'Acceso denegado' });
    }

    try {
      // Agrupar los visitantes por township de la visita
      const data = await Visitor.findAll({
        include: [{
          model: Visit,
          as: 'visit',
          attributes: [],
          required: true
        }],
        attributes: [
          [ col('visit.township'), 'township' ],
          // Contar los visitantes por grupo
          [ fn('COUNT', col('Visitor.id')), 'count' ]
        ],
        group: ['visit.township'],
        order: [[ col('visit.township'), 'ASC' ]]
      });

      // Mapear los resultados en formato para las estadísticas
      const result = data.map(item => ({
        township: item.getDataValue('township'),
        count: parseInt(item.getDataValue('count'), 10)
      }));

      return res.status(200).send({ data: result });
    } catch (error) {
      return res.status(500).send({ message: 'Error obteniendo visitantes por municipio' });
    }
  },
};
