'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const data = [];
    data.push({
      id:1,
      intrebare: "Cum ti s-a parut cursul?",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
      data.push({
        id:2,
        intrebare: "Ce nota ii dai profesorului?",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      data.push({
        id:3,
        intrebare: "Recomanzi materia?",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      data.push({
        id:4,
        intrebare: "Altceva?",
        createdAt: new Date(),
        updatedAt: new Date(),
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
