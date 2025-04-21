'use strict'

const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@example.com' }, {})
  },

  async up(queryInterface, Sequelize) {
    const existingUser = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE email = :email',
      {
        replacements: { email: 'admin@example.com' },
        type: Sequelize.QueryTypes.SELECT,
      },
    )

    if (existingUser.length === 0) {
      await queryInterface.bulkInsert('users', [
        {
          admin: true,
          email: 'admin@example.com',
          id_department: 1,
          name: 'Admin User',
          password: await bcrypt.hash('superpass', 10),
        },
      ])
      console.log('Admin user inserted!')
    } else {
      console.log('Admin user already exists, skipping insert.')
    }
  },
}
