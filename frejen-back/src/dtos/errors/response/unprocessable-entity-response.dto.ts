// src/dtos/errors/response/unprocessable-entity-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const UnprocessableEntityResponseDto = (message: string) => {
  return z.object({
    error: z.literal('Unprocessable Entity').openapi({
      description: 'Error type',
      example: 'Unprocessable Entity',
    }),
    message: z.string().default(message).openapi({
      description: 'Error message',
      example: message,
    }),
    statusCode: z.literal(422).openapi({
      description: 'HTTP status code',
      example: 422,
    }),
  })
}
