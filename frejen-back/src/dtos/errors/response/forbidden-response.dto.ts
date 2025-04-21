// src/dtos/errors/response/forbidden-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const ForbiddenResponseDto = (message: string) => {
  return z.object({
    error: z.literal('Forbidden').openapi({
      description: 'Error type',
      example: 'Forbidden',
    }),
    message: z.string().default(message).openapi({
      description: 'Error message',
      example: message,
    }),
    statusCode: z.literal(403).openapi({
      description: 'HTTP status code',
      example: 403,
    }),
  })
}
