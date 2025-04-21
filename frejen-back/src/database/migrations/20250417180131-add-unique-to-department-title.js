'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async down(queryInterface) {
    await queryInterface.removeIndex('departments', ['title'])
  },

  async up(queryInterface) {
    await queryInterface.addIndex('departments', ['title'], {
      unique: true,
    })
  },
}
