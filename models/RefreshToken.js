// models/RefreshToken.js
import { Model, DataTypes } from 'sequelize';

export default class RefreshToken extends Model {
  static initModel(sequelize) {
    RefreshToken.init({
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      token: {type: DataTypes.STRING(500), allowNull: false, unique: true},
      user_id: {type: DataTypes.INTEGER, allowNull: false},
      created_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
      expires_at: {type: DataTypes.DATE, allowNull: false}
    }, {
      sequelize,
      modelName: 'RefreshToken',
      tableName: 'refresh_tokens',
      timestamps: false
    });
  }
}
