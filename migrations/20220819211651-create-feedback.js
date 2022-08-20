'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Feedbacks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_student: {
        type: Sequelize.INTEGER,
      },
      id_profesor: {
        type: Sequelize.INTEGER,
      },
      Raspuns1: {
        type: Sequelize.STRING
      },
      Raspuns2: {
        type: Sequelize.STRING
      },
      Raspuns3: {
        type: Sequelize.STRING
      },
      Raspuns4: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Feedbacks');
  }
};