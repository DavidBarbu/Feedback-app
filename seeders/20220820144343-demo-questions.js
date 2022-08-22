'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const data = [];
    data.push({
      id:1,
      intrebare: "Cum ti s-a parut cursul?"
    }),
      data.push({
        id:2,
        intrebare: "Ce nota ii dai profesorului?"
      }),
      data.push({
        id:3,
        intrebare: "Recomanzi materia?"
      }),
      data.push({
        id:4,
        intrebare: "Altceva?"
      }),
      /**
       * Add seed commands here.
       *
       * Example:
       * await queryInterface.bulkInsert('People', [{
       *   name: 'John Doe',
       *   isBetaMember: false
       * }], {});
      */
      await queryInterface.bulkInsert('Questions', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Questions", null, {});
  }
};
