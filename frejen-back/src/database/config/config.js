// src/database/config/config.ts

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
})

/**
 * @type {import('sequelize').Options}
 */
const development = {
  database: process.env.DB_NAME,
  define: {
    underscored: true,
  },
  dialect: 'mysql',
  host: process.env.DB_HOST,
  logging: false,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
}

const production = {
  database: process.env.DB_NAME,
  define: {
    underscored: true,
  },
  dialect: 'mysql',
  host: process.env.DB_HOST,
  logging: false,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
}

/**
 * @type {{ development: import('sequelize').Options }}
 */
const config = {
  development,
  production,
}

module.exports = config
