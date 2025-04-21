// src/routes/user.route.ts

import { Request, Response, Router } from 'express'

import { diContainer } from '@/containers'
import { authenticate } from '@/middlewares/authenticate'
import { RequestTyped } from '@/types/request-typed'

const userRouter = Router()

const { updateUserController } = diContainer.user

// PATCH /users/:id
userRouter.patch('/:id', authenticate, (req: Request, res: Response) =>
  updateUserController.handle(req as RequestTyped, res),
)

export { userRouter }
