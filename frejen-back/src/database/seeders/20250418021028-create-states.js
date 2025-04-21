'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async down(queryInterface) {
    await queryInterface.bulkDelete('states', null, {})
  },

  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'states',
      [
        { title: 'PENDING' },
        { title: 'REJECTED' },
        { title: 'IN_PROGRESS' },
        { title: 'COMPLETED' },
      ],
      {},
    )
  },
}
