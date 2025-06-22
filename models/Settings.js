import { Model, DataTypes } from 'sequelize';

export default class Settings extends Model {
  static initModel(sequelize) {
    Settings.init({
      id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      capacity: { type: DataTypes.INTEGER, allowNull: false },
      companion_discount: { type: DataTypes.FLOAT, allowNull: false },
    }, {
      sequelize,
      modelName: 'Settings',
      tableName: 'settings',
      timestamps: false
    });
  }
}

