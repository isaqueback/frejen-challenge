// src/dtos/errors/response/not-found-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const NotFoundResponseDto = (message: string) => {
  return z.object({
    error: z.literal('Not Found').openapi({
      description: 'Error type',
      example: 'Not Found',
    }),
    message: z.string().default(message).openapi({
      description: 'Error message',
      example: message,
    }),
    statusCode: z.literal(404).openapi({
      description: 'HTTP status code',
      example: 404,
    }),
  })
}
