import { Model, DataTypes } from 'sequelize';

// Modelo de pagos de acuerdo a la tabla 'payments'
export default class Payment extends Model {
  static initModel(sequelize) {
    Payment.init({
      id:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      payment_date:  { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      payment_type:  { type: DataTypes.ENUM('Efectivo','Tarjeta'), allowNull: false },
      total:      { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    }, {
      sequelize,
      modelName: 'Payment',
      tableName: 'payments',
      timestamps: false
    });
  }
}
