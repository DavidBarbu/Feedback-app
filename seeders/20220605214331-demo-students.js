'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {

    const data = [];
    for (let i = 2; i < 100; i++) {
      data.push({
        id:i,
        email: i + "@s.unibuc.ro",
        firstName: i + "" + i,
        lastName: i - 1 + "" + (i - 1),
        password: "parola" + i,
        userType: "student",
        class: Math.trunc(i%3+1)*100+((i*i*i+15)%3+1)*10+((i*i+27)%3+1),
        year: Math.trunc(i%3+1),
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