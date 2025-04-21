// src/middlewares/authenticate.ts

import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

import { accessTokenSchema } from '@/docs/access-token-schema'
import { env } from '@/env'
import { BaseError, InternalServerError, UnauthorizedError } from '@/errors'
import { UserRepository } from '@/repositories/user/user.repository'
import { AccessTokenPayload } from '@/types/access-token-payload'
import { RequestTyped } from '@/types/request-typed'

const userRepository = new UserRepository()

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies['accessToken']
  const parsed = accessTokenSchema.safeParse({ accessToken: token })

  if (!parsed.success) {
    res.clearCookie('accessToken')

    throw new UnauthorizedError('Invalid access token')
  }

  const { accessToken } = parsed.data

  try {
    const decoded = jwt.verify(
      accessToken,
      env.JWT_SECRET,
    ) as AccessTokenPayload

    const user = await userRepository.findById(decoded.userId)
    if (!user || decoded.email !== user.email) {
      res.clearCookie('accessToken')
      throw new UnauthorizedError('User from token not found')
    }

    ;(req as RequestTyped).user = user
    ;(req as RequestTyped).accessToken = accessToken
    ;(req as RequestTyped).accessTokenDecoded = decoded

    next()
  } catch (err) {
    res.clearCookie('accessToken')

    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired')
    } else if (err instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token')
    } else if (err instanceof BaseError) {
      throw err
    }

    throw new InternalServerError('Internal server error')
  }
}
