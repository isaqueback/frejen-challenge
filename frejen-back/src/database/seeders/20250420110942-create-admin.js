'use strict'

const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@example.com' }, {})
  },

  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        admin: true,

        email: 'admin@example.com',

        id_department: 1,
        name: 'Admin User',
        password: await bcrypt.hash('superpass', 10),
      },
    ])
  },
}
