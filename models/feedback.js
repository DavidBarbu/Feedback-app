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
    Raspuns1: DataTypes.STRING,
    Raspuns2: DataTypes.STRING,
    Raspuns3: DataTypes.STRING,
    Raspuns4: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Feedback',
  });
  return Feedback;
};