// src/controllers/auth/sign-out.controller.ts

import { Request, Response } from 'express'

import { HttpStatus } from '@/constants/http-status.constant'

export class SignOutController {
  async handle(req: Request, res: Response): Promise<void> {
    res.clearCookie('accessToken')

    res.status(HttpStatus.NO_CONTENT).json()
  }
}
