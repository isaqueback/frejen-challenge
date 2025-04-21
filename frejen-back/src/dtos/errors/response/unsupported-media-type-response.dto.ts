// src/dtos/errors/response/unsupported-media-type-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const UnsupportedMediaTypeResponseDto = (message: string) => {
  return z.object({
    error: z.literal('Unsupported Media Type').openapi({
      description: 'Error type',
      example: 'Unsupported Media Type',
    }),
    message: z.string().default(message).openapi({
      description: 'Error message',
      example: message,
    }),
    statusCode: z.literal(415).openapi({
      description: 'HTTP status code',
      example: 415,
    }),
  })
}
