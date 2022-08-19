'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {

    const data = [];
    for (let i = 1; i < 100; i++) {
      data.push({
        email: i + "@s.unibuc.ro",
        firstName: i + "" + i,
        lastName: i - 1 + "" + (i - 1),
        password: "parola" + i,
        userType: "student",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    data.push({
      email: "david.barbu@s.unibuc.ro",
      firstName: "Barbu",
      lastName: "David Emanuel",
      password: "parolatest",
      userType: "student",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await queryInterface.bulkInsert('Students', data, {});

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
    await queryInterface.bulkDelete("Students", null, {});
  }
};