'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async down(queryInterface) {
    await queryInterface.bulkDelete('departments', null, {})
  },

  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'departments',
      [
        { title: 'HR' },
        { title: 'Engineering' },
        { title: 'Development' },
        { title: 'Marketing' },
      ],
      {},
    )
  },
}
