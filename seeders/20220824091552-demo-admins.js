'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [];
    data.push({
      email: "conducere@conducere",
      password: "conducere",
      userType: "conducere",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    data.push({
      email: "admin@admin",
      password: "admin",
      userType: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await queryInterface.bulkInsert('Admins', data, {});
  },



  down: async (queryInterface, Sequelize) => {
    
     await queryInterface.bulkDelete("Admins", null, {});
  }
};
