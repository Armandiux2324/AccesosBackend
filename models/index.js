import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
  }
);

//Importación de modelos
import User      from './User.js';
import Visit     from './Visit.js';
import Visitor   from './Visitor.js';
import Ticket    from './Ticket.js';
import Payment   from './Payment.js';
import Price     from './Price.js';
import Settings  from './Settings.js';

// Inicializar con sequelize
User.initModel(sequelize);
Visit.initModel(sequelize);
Visitor.initModel(sequelize);
Ticket.initModel(sequelize);
Payment.initModel(sequelize);
Price.initModel(sequelize);
Settings.initModel(sequelize);

//Relaciones
Visit.hasMany(Visitor, { foreignKey: 'visit_id', as: 'visitors' });
Visitor.belongsTo(Visit, { foreignKey: 'visit_id', as: 'visit' });

Visitor.belongsTo(Price, { foreignKey: 'price_id', as: 'price' });
Price.hasMany(Visitor, { foreignKey: 'price_id', as: 'visitors' });

Visit.hasOne(Ticket, { foreignKey: 'visit_id', as: 'ticket' });
Ticket.belongsTo(Visit, { foreignKey: 'visit_id', as: 'visit' });

Payment.hasOne(Ticket, { foreignKey: 'payment_id', as: 'ticket' });
Ticket.belongsTo(Payment, { foreignKey: 'payment_id', as: 'payment' });

export {
  sequelize,
  User,
  Visit,
  Visitor,
  Ticket,
  Payment,
  Price,
  Settings
};
