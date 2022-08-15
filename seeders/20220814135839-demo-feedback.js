'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const data = [];
    let k=0
    for (let i = 1; i < 101; i++)
      for (let j = 0; j < 100; j++) {
        k++;
        data.push({
          id:k,
          id_student: i,
          id_profesor: j,
          //Question1: "Cum vi s-a parut cursul?",
          //Question2: "Ce nota ii dati profesorului?",
          //Question3: "Aveti ceva de adaugat?",
          Materie: "",
          
          Question1: "",
          Question2: "",
          Question3: "",

          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    await queryInterface.bulkInsert('Feedbacks', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Feedbacks", null, {});
  }
};
