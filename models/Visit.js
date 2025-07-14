import { Model, DataTypes } from 'sequelize';

export default class Visit extends Model {
  static initModel(sequelize) {
    Visit.init({
      id:               { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      contact:          { type: DataTypes.STRING(100), allowNull: false },
      school:     { type: DataTypes.STRING(150), allowNull: true },
      township:   { type: DataTypes.STRING(100), allowNull: false },
      datetime_begin:   { type: DataTypes.DATE, allowNull: true },
      datetime_end:     { type: DataTypes.DATE, allowNull: true },
      duration_minutes: { type: DataTypes.INTEGER, allowNull: true },
      created_at:   { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    }, {
      sequelize,
      modelName: 'Visit',
      tableName: 'visits',
      timestamps: false
    });
  }
}

