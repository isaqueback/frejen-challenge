// src/dtos/errors/response/unauthorized-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const UnauthorizedResponseDto = (message: string) => {
  return z.object({
    error: z.literal('Unauthorized').openapi({
      description: 'Error type',
      example: 'Unauthorized',
    }),
    message: z.string().default(message).openapi({
      description: 'Error message',
      example: message,
    }),
    statusCode: z.literal(401).openapi({
      description: 'HTTP status code',
      example: 401,
    }),
  })
}
