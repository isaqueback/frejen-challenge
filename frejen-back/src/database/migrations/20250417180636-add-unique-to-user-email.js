'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async down(queryInterface) {
    await queryInterface.removeIndex('users', ['email'])
  },

  async up(queryInterface) {
    await queryInterface.addIndex('users', ['email'], {
      unique: true,
    })
  },
}
