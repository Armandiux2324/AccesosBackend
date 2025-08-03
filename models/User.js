import { Model, DataTypes } from 'sequelize';

// Modelo de usuarios de acuerdo a la tabla 'users'
export default class User extends Model {
  static initModel(sequelize) {
    User.init({
      id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name:      { type: DataTypes.STRING(100), allowNull: false },
      username:  { type: DataTypes.STRING(100), allowNull: false, unique: true },
      email:     { type: DataTypes.STRING(100), allowNull: false },
      password:  { type: DataTypes.STRING(255), allowNull: false },
      role:      { type: DataTypes.ENUM('Director','Administrador','Taquilla'), allowNull: false }
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: false
    });
  }
}

