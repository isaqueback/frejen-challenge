// src/dtos/auth/response/me-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const MeResponseDto = z
  .object({
    admin: z.boolean().openapi({
      description: 'Indicates if the user is an admin',
      example: true,
    }),
    departmentId: z.number().int().positive().openapi({
      description: 'ID of the department the user belongs to',
      example: 1,
    }),
    email: z.string().email().openapi({
      description: 'Email of the user',
      example: 'john_doe@example.com',
    }),
    name: z.string().nonempty().openapi({
      description: 'Name of the user',
      example: 'John Doe',
    }),
    userId: z.number().int().positive().openapi({
      description: 'ID of the user',
      example: 1,
    }),
  })
  .strict()

export type MeResponseDtoType = z.infer<typeof MeResponseDto>
