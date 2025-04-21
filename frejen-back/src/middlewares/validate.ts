// src/middlewares/validate.ts

import { NextFunction, Request, Response } from 'express'
import { ZodSchema } from 'zod'

import { UnprocessableEntityError } from '@/errors'

export const validate =
  (schema: ZodSchema, target: 'body' | 'params' | 'query' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target])

    if (!result.success) {
      throw new UnprocessableEntityError(result.error)
    }

    if (target === 'query') {
      ;(req as any).validatedQuery = result.data
    } else {
      req[target] = result.data
    }
    Object.assign(req[target], result.data)

    next()
  }
