// src/types/request-typed.ts

import { Request } from 'express'

import { UserEntity } from '@/entities/user.entity'

import { AccessTokenPayload } from './access-token-payload'

export interface RequestTyped extends Request {
  validatedQuery?: unknown
  user: UserEntity
  accessToken: string
  accessTokenDecoded: AccessTokenPayload
}
