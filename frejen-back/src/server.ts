// src/server.ts

import { exec } from 'child_process'
import { Application } from 'express'
import { promisify } from 'util'

import { createDatabaseIfNotExists, sequelize } from '@/database'
import { env } from '@/env'

import { App } from './app'
import { setupAssociations } from './database/associations'

const execPromise = promisify(exec)

class Server {
  private app: Application

  constructor() {
    this.app = new App().app
  }

  async start() {
    try {
      // Step 1: Initialize the database and run migrations and seeds
      await this.initializeDatabase()

      // Step 2: Run migrations and seeds
      await this.runPostStartupTasks()

      // Step 3: Start the server after migrations and seeds
      this.startServer(env.PORT)
    } catch (error) {
      console.error('❌ Unable to start the server:', error)
      process.exit(1)
    }
  }

  private async initializeDatabase() {
    try {
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
    } catch (error) {
      console.error('❌ Error initializing the database:', error)
      process.exit(1)
    }
  }

  private startServer(port: number = 3000) {
    this.app.listen(port, () => {
      console.log(`\n🚀 Server is running on port ${port}!\n`)
    })
  }

  private async runPostStartupTasks() {
    try {
      console.log('📦 Running post-startup migrations and seeds...')

      // Run the migrations first
      console.log('📝 Running migrations...')
      await execPromise('npm run migrate:prod')
      console.log('✅ Migrations completed!')

      // Run the seeds next
      console.log('📝 Running seeds...')
      await execPromise('npm run seed:prod')
      console.log('✅ Seeds completed!')
    } catch (err) {
      console.error('❌ Failed to run migrations or seeds:', err)
      process.exit(1) // Stop the process if migrations or seeds fail
    }
  }
}

// Instantiate and start the server
const server = new Server()
server.start()
