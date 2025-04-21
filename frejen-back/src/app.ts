// src/app.ts

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'

import { openApiDoc } from './docs/swagger'
import { env } from './env'
import { errorHandler } from './errors/error-handler'
import { router } from './routes'

class App {
  public app: express.Application

  constructor() {
    this.app = express()

    // Initialize middlewares, routes, and error handling
    this.initializeMiddleware()
    this.initializeRoutes()
    this.initializeErrorHandling()
  }

  private initializeMiddleware() {
    const corsOptions: cors.CorsOptions = {
      allowedHeaders: ['Content-Type'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'OPTIONS', 'PATCH'],
      origin: env.FRONT_END_BASE_URL,
    }

    // Middlewares
    this.app.use(cors(corsOptions)) // Enable CORS with options
    this.app.use(express.json()) // Parse JSON request bodies
    this.app.use(express.urlencoded({ extended: true })) // Parse URL-encoded request bodies
    this.app.use(cookieParser()) // Parse cookies

    // Swagger UI setup
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc))
  }

  private initializeRoutes() {
    // Routes
    this.app.use(router)
  }

  private initializeErrorHandling() {
    // Error handling middleware
    this.app.use(
      (err: unknown, req: Request, res: Response, next: NextFunction) => {
        errorHandler(err, req, res, next)
      },
    )
  }
}

export { App }
