'use strict';
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Students', [
      {
        id: 1,
        email: "dada@da.da",
        firstName: "Da",
        lastName: "Nu",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        email: "daada@da.da",
        firstName: "Da",
        lastName: "Nu",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        email: "dadaaa@da.da",
        firstName: "Da",
        lastName: "Nu",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        email: "admin@s.unibuc.ro",
        firstName: "Admin",
        lastName: "Admin",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
    ]);
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
  }
};
