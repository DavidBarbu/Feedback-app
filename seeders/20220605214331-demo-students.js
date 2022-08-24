'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    function getRandomItem(arr) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      const item = arr[randomIndex];

      return item;
    }
    const ani = [1,2,3,4]
    const nrGrupe = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414]
    const data = [];
    for (let i = 2; i < 100; i++) {
      data.push({
        id:i,
        email: i + "@s.unibuc.ro",
        firstName: i + "" + i,
        lastName: i - 1 + "" + (i - 1),
        password: "parola" + i,
        userType: "student",
        class: getRandomItem(nrGrupe),
        year: getRandomItem(ani),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    data.push({
      id:1,
      email: "david.barbu@s.unibuc.ro",
      firstName: "Barbu",
      lastName: "David Emanuel",
      password: "parolatest",
      userType: "student",
      class: 312,
      year: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await queryInterface.bulkInsert('Students', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkDelete("Students", null, {});
  }
};