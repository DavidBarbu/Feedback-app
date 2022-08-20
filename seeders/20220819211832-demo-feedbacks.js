'use strict';

const { json } = require("body-parser");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [];
    for (let i = 0; i < 99; i++)
      for (let j = 1; j < 100; j++) {
        data.push({
          id_student: i,
          id_profesor: j,
          Raspuns1: "",
          Raspuns2: "",
          Raspuns3: "",
          Raspuns4: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
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
