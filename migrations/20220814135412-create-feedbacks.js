'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Feedbacks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_student: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      id_profesor: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      Question1: {
        type: Sequelize.STRING
      },
      Question2: {
        type: Sequelize.STRING
      },
      Question3: {
        type: Sequelize.STRING
      },
      Materie: {
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