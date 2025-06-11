import { Model, DataTypes } from 'sequelize';

export default class Visitor extends Model {
  static initModel(sequelize) {
    Visitor.init({
      id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      age:        { type: DataTypes.INTEGER, allowNull: false },
      gender:     { type: DataTypes.ENUM('Masculino','Femenino','Otro'), allowNull: false },
      school:     { type: DataTypes.STRING(150), allowNull: false },
      township:   { type: DataTypes.STRING(100), allowNull: true },
      unit_price: { type: DataTypes.FLOAT, allowNull: false },
      visit_id:   { type: DataTypes.INTEGER, allowNull: false }
    }, {
      sequelize,
      modelName: 'Visitor',
      tableName: 'visitors',
      timestamps: false,
      indexes: [
        { name: 'fk_visitor_visit_idx', fields: ['visit_id'] }
      ]
    });
  }
}

