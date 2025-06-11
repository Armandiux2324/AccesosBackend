import { Model, DataTypes } from 'sequelize';

export default class Payment extends Model {
  static initModel(sequelize) {
    Payment.init({
      id:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      reference:     { type: DataTypes.STRING(100), allowNull: true },
      payment_date:  { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      payment_type:  { type: DataTypes.ENUM('Efectivo','Tarjeta'), allowNull: false }
    }, {
      sequelize,
      modelName: 'Payment',
      tableName: 'payments',
      timestamps: false
    });
  }
}
