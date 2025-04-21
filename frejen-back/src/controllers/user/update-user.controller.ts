// src/controllers/user/update-user.controller.ts

import { addMilliseconds } from 'date-fns'
import { Response } from 'express'

import { HttpStatus } from '@/constants/http-status.constant'
import { UpdateUserRequestDto } from '@/dtos/user/request/update-user-request.dto'
import { env } from '@/env'
import { UnprocessableEntityError } from '@/errors'
import { UserService } from '@/services/user.service'
import { RequestTyped } from '@/types/request-typed'

export class UpdateUserController {
  constructor(private readonly userService: UserService) {}

  async handle(req: RequestTyped, res: Response): Promise<void> {
    const paramUserId = req.params.id
    const user = req.user

    const parsed = UpdateUserRequestDto.safeParse({
      ...req.body,
      paramUserId,
    })

    if (!parsed.success) {
      throw new UnprocessableEntityError(parsed.error)
    }

    const { newAccessToken: accessToken } = await this.userService.update({
      ...parsed.data,
      user,
    })

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
