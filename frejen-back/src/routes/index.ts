// src/routes/index.ts

import { Router } from 'express'

import { authRouter } from './auth.route'
import { departmentRouter } from './department.route'
import { stateRouter } from './state.route'
import { ticketRouter } from './ticket.route'
import { userRouter } from './user.route'

const router = Router()

// Auth Route
router.use('/auth', authRouter)

// User Route
router.use('/users', userRouter)

// State Route
router.use('/states', stateRouter)

// Department Route
router.use('/departments', departmentRouter)

// Ticket Route
router.use('/tickets', ticketRouter)

export { router }
