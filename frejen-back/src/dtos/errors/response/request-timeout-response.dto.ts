// src/dtos/errors/response/request-timeout-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const RequestTimeoutResponseDto = (message: string) => {
  return z.object({
    error: z.literal('Request Timeout').openapi({
      description: 'Error type',
      example: 'Request Timeout',
    }),
    message: z.string().default(message).openapi({
      description: 'Error message',
      example: message,
    }),
    statusCode: z.literal(408).openapi({
      description: 'HTTP status code',
      example: 408,
    }),
  })
}
