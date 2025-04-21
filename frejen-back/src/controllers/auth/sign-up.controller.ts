// src/controller/auth/sign-up.controller.ts

import { Request, Response } from 'express'

import { HttpStatus } from '@/constants/http-status.constant'
import { SignUpRequestDto } from '@/dtos/auth/request/sign-up-request.dto'
import { UnprocessableEntityError } from '@/errors'
import { AuthService } from '@/services/auth.service'

export class SignUpController {
  constructor(private readonly userService: AuthService) {}

  async handle(req: Request, res: Response): Promise<void> {
    const parsed = SignUpRequestDto.safeParse(req.body)

    if (!parsed.success) {
      throw new UnprocessableEntityError(parsed.error)
    }

    await this.userService.signUp(parsed.data)

    res.status(HttpStatus.CREATED).send()
  }
}
