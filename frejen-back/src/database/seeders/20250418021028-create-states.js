'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async down(queryInterface) {
    await queryInterface.bulkDelete('states', null, {})
  },

  async up(queryInterface, Sequelize) {
    const states = await queryInterface.sequelize.query(
      'SELECT title FROM states WHERE title IN (:titles)',
      {
        replacements: {
          titles: ['PENDING', 'REJECTED', 'IN_PROGRESS', 'COMPLETED'],
        },
        type: Sequelize.QueryTypes.SELECT,
      },
    )

    const existingTitles = states.map((state) => state.title)

    const newStates = [
      { title: 'PENDING' },
      { title: 'REJECTED' },
      { title: 'IN_PROGRESS' },
      { title: 'COMPLETED' },
    ].filter((state) => !existingTitles.includes(state.title))

    if (newStates.length > 0) {
      await queryInterface.bulkInsert('states', newStates, {})
      console.log(`${newStates.length} new states inserted!`)
    } else {
      console.log('No new states to insert.')
    }
  },
}
