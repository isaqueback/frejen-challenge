// src/dtos/errors/response/bad-request-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const BadRequestResponseDto = (message: string) => {
  return z.object({
    error: z.literal('Bad Request').openapi({
      description: 'Error type',
      example: 'Bad Request',
    }),
    message: z.string().default(message).openapi({
      description: 'Error message',
      example: message,
    }),
    statusCode: z.literal(400).openapi({
      description: 'HTTP status code',
      example: 400,
    }),
  })
}
