// src/controllers/auth/me.controller.ts

import { Response } from 'express'

import { HttpStatus } from '@/constants/http-status.constant'
import { AccessTokenPayload } from '@/types/access-token-payload'
import { RequestTyped } from '@/types/request-typed'

export class MeController {
  async handle(req: RequestTyped, res: Response): Promise<void> {
    const user = req.user

    const accessTokenUser: AccessTokenPayload = {
      admin: user.admin,
      departmentId: user.id_department,
      email: user.email,
      name: user.name,
      userId: user.id,
    }

    res.status(HttpStatus.OK).json(accessTokenUser)
  }
}
