'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    function getRandomItem(arr) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      const item = arr[randomIndex];

      return item;
    }
    const data = [];
    const materii = ['Algebra', 'Geometrie', 'Analiza', 'Statistica','Geometrie 2','Algebra Liniara', 'Geometrie in spatiu', 'Analiza Numerica', 'Probabilitati','Unity']
    const nrGrupe = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414]
    for (let i = 0; i <500; i++) {
    data.push({
      id: i+1,
      nume_materie: getRandomItem(materii),
      grupa: getRandomItem(nrGrupe),
      semestru:  Math.floor(Math.random()*2+1),
      id_profesor:  Math.floor(Math.random()*Math.random()*100+1),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
    await queryInterface.bulkInsert('Subjects', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Subjects", null, {});
  }
};
