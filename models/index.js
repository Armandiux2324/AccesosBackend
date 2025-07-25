import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',

    timezone: '-06:00',

    dialectOptions: {
      dateStrings: true,
      typeCast: true
    },

    logging: false
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
import RefreshToken from './RefreshToken.js';

// Inicializar modelos con sequelize
User.initModel(sequelize);
Visit.initModel(sequelize);
Visitor.initModel(sequelize);
Ticket.initModel(sequelize);
Payment.initModel(sequelize);
Price.initModel(sequelize);
Settings.initModel(sequelize);
RefreshToken.initModel(sequelize);

//Relaciones
// Un usuario puede tener muchas visitas
User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refresh_tokens' });
// Un refresh token pertenece a un usuario
RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Una visita puede tener muchos visitantes
Visit.hasMany(Visitor, { foreignKey: 'visit_id', as: 'visitors' });
// Un visitante pertenece a una visita
Visitor.belongsTo(Visit, { foreignKey: 'visit_id', as: 'visit' });

// Un visitante pertenece a un precio
Visitor.belongsTo(Price, { foreignKey: 'price_id', as: 'price' });
// Un precio puede tener muchos visitantes
Price.hasMany(Visitor, { foreignKey: 'price_id', as: 'visitors' });

// Una visita tiene un ticket
Visit.hasOne(Ticket, { foreignKey: 'visit_id', as: 'ticket' });
// Un ticket pertenece a una visita
Ticket.belongsTo(Visit, { foreignKey: 'visit_id', as: 'visit' });

// Un pago tiene un ticket
Payment.hasOne(Ticket, { foreignKey: 'payment_id', as: 'ticket' });
// Un ticket pertenece a un pago
Ticket.belongsTo(Payment, { foreignKey: 'payment_id', as: 'payment' });

// Exportar los modelos y la conexión
export {
  sequelize,
  User,
  Visit,
  Visitor,
  Ticket,
  Payment,
  Price,
  Settings,
  RefreshToken
};
