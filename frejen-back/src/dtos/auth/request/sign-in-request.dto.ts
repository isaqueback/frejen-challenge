// src/dtos/auth/request/sign-in-request.dto.ts
import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const SignInRequestDto = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .transform((val) => val.trim().toLowerCase())
    .openapi({ description: 'User email', example: 'user@example.com' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .openapi({ description: 'User password', example: 'pass1234' }),
})

export type SignInRequestDtoType = z.infer<typeof SignInRequestDto>
