// src/routes/auth.route.ts

import { Request, Response, Router } from 'express'

import { diContainer } from '@/containers'
import { authenticate } from '@/middlewares/authenticate'
import { RequestTyped } from '@/types/request-typed'

const authRouter = Router()
const { signInController, signUpController, signOutController, meController } =
  diContainer.auth

// POST /auth/sign-in
authRouter.post('/sign-in', (req: Request, res: Response) =>
  signInController.handle(req, res),
)

// POST /auth/sign-up
authRouter.post('/sign-up', (req: Request, res: Response) =>
  signUpController.handle(req, res),
)

// GET /auth/sign-out
authRouter.get('/sign-out', (req: Request, res: Response) =>
  signOutController.handle(req, res),
)

// GET /auth/me
authRouter.get('/me', authenticate, (req: Request, res: Response) =>
  meController.handle(req as RequestTyped, res),
)

export { authRouter }
