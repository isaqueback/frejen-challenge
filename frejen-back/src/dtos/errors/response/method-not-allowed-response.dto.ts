// src/dtos/errors/response/method-not-allowed-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const MethodNotAllowedResponseDto = (message: string) => {
  return z.object({
    error: z.literal('Method Not Allowed').openapi({
      description: 'Error type',
      example: 'Method Not Allowed',
    }),
    message: z.string().default(message).openapi({
      description: 'Error message',
      example: message,
    }),
    statusCode: z.literal(405).openapi({
      description: 'HTTP status code',
      example: 405,
    }),
  })
}
