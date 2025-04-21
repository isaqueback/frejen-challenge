// src/server.ts

import { Application } from 'express'

import { createDatabaseIfNotExists, sequelize } from '@/database'
import { env } from '@/env'

import { App } from './app'
import { setupAssociations } from './database/associations'

class Server {
  private app: Application

  constructor() {
    this.app = new App().app
  }

  async start() {
    try {
      // Step 1: Initialize the database
      await this.initializeDatabase()

      // Step 2: Start the server
      this.startServer(env.PORT)
    } catch (error) {
      console.error('❌ Unable to connect to the database:', error)
      process.exit(1)
    }
  }

  private async initializeDatabase() {
    // Step 1: Create the database if it does not exist
    await createDatabaseIfNotExists()

    // Step 2: Connect to the database
    await sequelize.authenticate()
    console.log(`🟢 Database '${env.DB_NAME}' connected!`)

    // Step 3: Setup associations
    setupAssociations()

    // Step 4: Synchronize the models
    await sequelize.sync({
      alter: process.env.NODE_ENV !== 'production' ? true : false,
    })
    console.log('📂 All models were synchronized!')
  }

  private startServer(port: number = 3000) {
    this.app.listen(port, () => {
      console.log(`\n🚀 Server is running on port ${port}!\n`)
    })
  }
}

// Instantiate and start the server
const server = new Server()
server.start()
