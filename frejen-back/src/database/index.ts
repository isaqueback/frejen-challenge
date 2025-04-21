// src/database/index.ts

import { Options, Sequelize } from 'sequelize'

import { env } from '@/env'

const config: Record<
  'development' | 'production' | 'test',
  Options
> = require('./config/config.js')

// Initial instance to verify and create the database
const tempSequelize = new Sequelize('mysql', env.DB_USER, env.DB_PASSWORD, {
  define: {
    underscored: true,
  },
  dialect: 'mysql',
  host: env.DB_HOST,
  logging: false,
  port: env.DB_PORT,
})

// Function to ensure the 'ticket_manager' database exists
export const createDatabaseIfNotExists = async () => {
  try {
    // Authenticate the initial connection to verify the connection to MySQL
    await tempSequelize.authenticate()
    console.log("🟢 Database 'mysql' connected!")

    // Check if the database already exists
    const [results] = await tempSequelize.query(
      "SHOW DATABASES LIKE 'ticket_manager'",
    )

    // If the database doesn't exist, create it
    if (!results.length) {
      await tempSequelize.query(
        'CREATE DATABASE ticket_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
      )
      console.log("📦 Database 'ticket_manager' created!")
    } else {
      console.log("📦 Database 'ticket_manager' already exists!")
    }

    // Close the temporary connection with 'mysql' right after the check
    await tempSequelize.close()
    console.log("↩️  Database 'mysql' disconnected!")
  } catch (err) {
    console.error('❌ Error during database creation:', err)
    throw err
  }
}

// Now, create the final Sequelize instance connected to the 'ticket_manager' database
export const sequelize = new Sequelize(config[env.NODE_ENV])
