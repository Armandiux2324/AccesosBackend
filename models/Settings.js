import { Model, DataTypes } from 'sequelize';

// Modelo de configuraciones de acuerdo a la tabla 'settings'
export default class Settings extends Model {
  static initModel(sequelize) {
    Settings.init({
      id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      capacity: { type: DataTypes.INTEGER, allowNull: false },
      companion_discount: { type: DataTypes.FLOAT, allowNull: false },
      student_discount: { type: DataTypes.FLOAT, allowNull: false},
    }, {
      sequelize,
      modelName: 'Settings',
      tableName: 'settings',
      timestamps: false
    });
  }
}

