'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Feedback.init({
    id_student: DataTypes.NUMBER,
    id_profesor: DataTypes.NUMBER,
    id_intrebare: DataTypes.NUMBER,
    raspuns: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Feedback',
  },
  {
    initialAutoIncrement: 1,
  });
  return Feedback;
};