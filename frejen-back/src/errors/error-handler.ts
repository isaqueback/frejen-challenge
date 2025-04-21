// src/errors/error-handler.ts

import { NextFunction, Request, Response } from 'express'

import { HttpStatus } from '@/constants/http-status.constant'

import { BaseError } from '.'

function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json(err.toJSON())
  }

  if (
    err instanceof SyntaxError &&
    (err as any).type === 'entity.parse.failed'
  ) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      error: 'Bad Request',
      message: 'JSON invalid. Check the request body',
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }

  console.error(err)

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    error: 'Internal Server Error',
    message: 'Internal Server Error',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  })
}

export { errorHandler }
