'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const data = [];
    data.push({
      id:1,
      intrebare: "Ce nota dai profesorului? (1-10)",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
      data.push({
        id:2,
        intrebare: "Pe o scara de la 1 la 10, cat de mult ai inteles din materia aceasta?",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      data.push({
        id:3,
        intrebare: "Pe o scara de la 1 la 10, cat de bine a explicat profesorul materia?",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      data.push({
        id:4,
        intrebare: "Pe o scara de la 1 la 10, cat de mult crezi ca si-a dat profesorul interesul?",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      data.push({
        id:5,
        intrebare: "Pe o scara de la 1 la 10, cat de bine pregatit consideri ca este profesorul?",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      data.push({
        id:6,
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
