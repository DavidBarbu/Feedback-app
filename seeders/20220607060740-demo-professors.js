'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    function getRandomItem(arr) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      const item = arr[randomIndex];

      return item;
    }
    const materii = ['Algebra', 'Geometrie', 'Analiza', 'Statistica','Geometrie 2','Algebra Liniara', 'Geometrie in spatiu', 'Analiza Numerica', 'Probabilitati','Unity']
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
         materie_predata: getRandomItem(materii),
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
