'use strict';

const { json } = require("body-parser");

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const data = [];
    for (let i = 1; i < 100; i++)
      for (let j = 1; j < 100; j++) {
        data.push({
          id_student: i,
          id_profesor: j,
          Question1: "Cum ti s-a parut cursul?",
          Question2: "Ce nota ii dai profesorului?",
          Question3: "Altceva?",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    await queryInterface.bulkInsert('Feedbacks', data, {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Feedbacks", null, {});
  }
};
