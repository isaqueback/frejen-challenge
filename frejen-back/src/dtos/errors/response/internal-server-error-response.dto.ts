// src/dtos/errors/response/internal-server-error-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const InternalServerErrorResponseDto = (message: string) => {
  return z.object({
    error: z.literal('Internal Server Error').openapi({
      description: 'Error type',
      example: 'Internal Server Error',
    }),
    message: z.string().default(message).openapi({
      description: 'Error message',
      example: message,
    }),
    statusCode: z.literal(500).openapi({
      description: 'HTTP status code',
      example: 500,
    }),
  })
}
