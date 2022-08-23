'use strict';
const {
  Model
} = require('sequelize');
const getNumberOfQuestions = require('../controllers/users');
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
  let updateObject = {
    id_student: DataTypes.STRING,
    id_profesor: DataTypes.STRING,
  }
  for (let i = 0; i < 6; i++) {
    updateObject["Raspuns" + (i + 1)] = DataTypes.STRING;
  }
  Feedback.init(updateObject, {
    sequelize,
    modelName: 'Feedback',
  });
  return Feedback;
};