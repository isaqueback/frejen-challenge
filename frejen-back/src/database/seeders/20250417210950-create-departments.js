'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async down(queryInterface) {
    await queryInterface.bulkDelete('departments', null, {})
  },

  async up(queryInterface, Sequelize) {
    const departments = await queryInterface.sequelize.query(
      'SELECT title FROM departments WHERE title IN (:titles)',
      {
        replacements: {
          titles: ['HR', 'Engineering', 'Development', 'Marketing'],
        },
        type: Sequelize.QueryTypes.SELECT,
      },
    )

    const existingTitles = departments.map((department) => department.title)

    const newDepartments = [
      { title: 'HR' },
      { title: 'Engineering' },
      { title: 'Development' },
      { title: 'Marketing' },
    ].filter((department) => !existingTitles.includes(department.title))

    if (newDepartments.length > 0) {
      await queryInterface.bulkInsert('departments', newDepartments, {})
      console.log(`${newDepartments.length} new departments inserted!`)
    }
  },
}
