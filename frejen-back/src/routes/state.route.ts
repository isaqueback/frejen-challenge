// src/routes/state.route.ts

import { Router } from 'express'
import { Request, Response } from 'express'

import { diContainer } from '@/containers'
import { authenticate } from '@/middlewares/authenticate'
import { RequestTyped } from '@/types/request-typed'

const { findAllStatesController } = diContainer.state

const stateRouter = Router()

// GET /states
stateRouter.get('/', authenticate, (req: Request, res: Response) =>
  findAllStatesController.handle(req as RequestTyped, res),
)

export { stateRouter }
