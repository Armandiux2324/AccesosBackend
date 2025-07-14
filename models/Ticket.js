import { Model, DataTypes } from 'sequelize';

export default class Ticket extends Model {
  static initModel(sequelize) {
    Ticket.init({
      id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      visit_id:   { type: DataTypes.INTEGER, allowNull: false },
      qr:         { type: DataTypes.STRING(255), allowNull: true },
      status:     { type: DataTypes.ENUM('Activo','Inactivo','Sin iniciar'), defaultValue: 'Sin iniciar' , allowNull: false },
      payment_id: { type: DataTypes.INTEGER, allowNull: false },
      discount: { type: DataTypes.ENUM('Sí','No'), defaultValue: 'No' , allowNull: false }
    }, {
      sequelize,
      modelName: 'Ticket',
      tableName: 'tickets',
      timestamps: false,
      indexes: [
        { name: 'fk_ticket_visit_idx', fields: ['visit_id'] }
      ],
      uniqueKeys: {
        uq_visits_payment: { fields: ['payment_id'] }
      }
    });
  }
}

