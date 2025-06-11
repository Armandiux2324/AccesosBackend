import { Model, DataTypes } from 'sequelize';

export default class Capacity extends Model {
  static initModel(sequelize) {
    Capacity.init({
      id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      capacity: { type: DataTypes.INTEGER, allowNull: false }
    }, {
      sequelize,
      modelName: 'Capacity',
      tableName: 'capacity',
      timestamps: false
    });
  }
}

