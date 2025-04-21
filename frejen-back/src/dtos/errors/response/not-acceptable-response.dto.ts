// src/dtos/errors/response/not-acceptable-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const NotAcceptableResponseDto = (message: string) => {
  return z.object({
    error: z.literal('Not Acceptable').openapi({
      description: 'Error type',
      example: 'Not Acceptable',
    }),
    message: z.string().default(message).openapi({
      description: 'Error message',
      example: message,
    }),
    statusCode: z.literal(406).openapi({
      description: 'HTTP status code',
      example: 406,
    }),
  })
}
