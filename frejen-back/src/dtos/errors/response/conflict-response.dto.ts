// src/dtos/errors/response/conflict-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const ConflictResponseDto = (message: string) => {
  return z.object({
    error: z.literal('Conflict').openapi({
      description: 'Error type',
      example: 'Conflict',
    }),
    message: z.string().default(message).openapi({
      description: 'Error message',
      example: message,
    }),
    statusCode: z.literal(409).openapi({
      description: 'HTTP status code',
      example: 409,
    }),
  })
}
