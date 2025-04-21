// src/dtos/errors/response/gone-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const GoneResponseDto = (message: string) => {
  return z.object({
    error: z.literal('Gone').openapi({
      description: 'Error type',
      example: 'Gone',
    }),
    message: z.string().default(message).openapi({
      description: 'Error message',
      example: message,
    }),
    statusCode: z.literal(410).openapi({
      description: 'HTTP status code',
      example: 410,
    }),
  })
}
