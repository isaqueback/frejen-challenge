// src/dtos/auth/request/sign-up-request.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const SignUpRequestDto = z
  .object({
    email: z
      .string()
      .email({ message: 'Invalid email address' })
      .transform((val) => val.trim().toLowerCase())
      .openapi({
        description: 'User email address',
        example: 'user@example.com',
      }),
    id_department: z
      .number()
      .int()
      .positive({ message: 'Department ID must be a positive integer' })
      .openapi({
        description: 'Department ID',
        example: 1,
      }),
    name: z.string().min(1, { message: 'Name is required' }).openapi({
      description: 'User name',
      example: 'John Doe',
    }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .openapi({
        description: 'User password',
        example: 'yourpassword123',
      }),
  })
  .openapi({
    description: 'Sign up request data',
    required: ['email', 'id_department', 'name', 'password'],
  })

export type SignUpRequestDtoType = z.infer<typeof SignUpRequestDto>
