import { Model, DataTypes } from 'sequelize';

export default class Price extends Model {
  static initModel(sequelize) {
    Price.init({
      id:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      type:  { 
        type: DataTypes.ENUM('Niño','Niña','Hombre','Mujer','Discapacitado','Acompañante'),
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

