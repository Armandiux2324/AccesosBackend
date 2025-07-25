import { Model, DataTypes } from 'sequelize';

// Modelo de precios de acuerdo a la tabla 'prices'
export default class Price extends Model {
  static initModel(sequelize) {
    Price.init({
      id:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      type:  { 
        type: DataTypes.ENUM('Niño','Adulto','Adulto mayor','Discapacitado','Acompañante','Estudiante'),
        allowNull: false
      },
      price: { type: DataTypes.FLOAT, allowNull: false }
    }, {
      sequelize,
      modelName: 'Price',
      tableName: 'prices',
      timestamps: false
    });
  }
}

