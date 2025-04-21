// src/dtos/user/user-schema.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

import { DepartmentSchema } from '../department/department-schema'

extendZodWithOpenApi(z)

export const UserSchema = z.object({
  department: DepartmentSchema,
  email: z.string().email().openapi({
    description: 'Email of the user',
    example: 'john_doe@example.com',
  }),
  id: z.number().int().positive().openapi({
    description: 'ID of the user',
    example: 1,
  }),
  name: z.string().nonempty().openapi({
    description: 'Name of the user',
    example: 'John Doe',
  }),
})
