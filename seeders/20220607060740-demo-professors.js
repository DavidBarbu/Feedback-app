'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     const data = [];
     for(let i=0;i<100;i++)
     {
       data.push({
        id:i,
         email: i+"@unibuc.ro",
         firstName: i+""+i,
         lastName: i-1+""+(i-1),
         password: i+"parola",
         userType: "profesor",
         createdAt: new Date(),
         updatedAt: new Date(),
       });
     }
     await queryInterface.bulkInsert('Professors', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete("Professors", null, {});
  }
};
