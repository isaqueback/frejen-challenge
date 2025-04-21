// src/dtos/errors/response/payload-too-large-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const PayloadTooLargeResponseDto = (message: string) => {
  return z.object({
    error: z.literal('Payload Too Large').openapi({
      description: 'Error type',
      example: 'Payload Too Large',
    }),
    message: z.string().default(message).openapi({
      description: 'Error message',
      example: message,
    }),
    statusCode: z.literal(413).openapi({
      description: 'HTTP status code',
      example: 413,
    }),
  })
}
