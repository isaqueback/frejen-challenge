'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async down(queryInterface) {
    await queryInterface.bulkDelete('tickets', null, {})
  },

  async up(queryInterface) {
    const titles = [
      'System crash on login',
      'Feature request: Dark mode',
      'Email not being sent',
      'Unable to upload file',
      'Permission denied error',
      'Bug in dashboard layout',
      'Profile picture not saving',
      'Reset password email not received',
      'Missing translations in French',
      'Error 500 on submit',
      'App crashes on iOS',
      'Performance issue with reports',
      'UI glitch on Safari',
      'Attachment limit exceeded',
      'Unexpected logout',
      'Slow database response',
      'Incorrect time zone in logs',
      'Notification delay',
      'API returns 403',
      'Missing field validation',
      'Wrong data on export',
      'Integration not working',
      'Need custom report',
      'Broken link in help section',
      'Feedback form not submitting',
    ]

    const now = new Date()

    // Random helper
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

    const tickets = titles.map((title) => ({
      created_at: now,
      created_by: 1,
      description: `Description for ticket "${title}"`,

      id_department: rand(1, 4), // IDs: PENDING, REJECTED, IN_PROGRESS, COMPLETED

      id_state: rand(1, 4),

      observations: null,

      title,

      updated_at: now,
      updated_by: 1, // IDs: HR, Engineering, Development, Marketing
    }))

    await queryInterface.bulkInsert('tickets', tickets, {})
  },
}
