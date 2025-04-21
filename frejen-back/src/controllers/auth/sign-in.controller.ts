// src/controllers/auth/sign-in.controller.ts

import { addMilliseconds } from 'date-fns'
import { Request, Response } from 'express'

import { HttpStatus } from '@/constants/http-status.constant'
import { SignInRequestDto } from '@/dtos/auth/request/sign-in-request.dto'
import { env } from '@/env'
import { UnprocessableEntityError } from '@/errors'
import { AuthService } from '@/services/auth.service'

export class SignInController {
  constructor(private authService: AuthService) {}

  async handle(req: Request, res: Response): Promise<void> {
    const parsed = SignInRequestDto.safeParse(req.body)

    if (!parsed.success) {
      throw new UnprocessableEntityError(parsed.error)
    }

    const { accessToken } = await this.authService.signIn(parsed.data)

    res.clearCookie('accessToken')

    res.cookie('accessToken', accessToken, {
      expires: addMilliseconds(new Date(), env.ACCESS_TOKEN_EXPIRATION),
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: false,
    })

    res.status(HttpStatus.NO_CONTENT).json()
  }
}
