// src/dtos/department/department-schema.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const DepartmentSchema = z.object({
  id: z.number().int().positive().openapi({
    description: 'ID of the department',
    example: 1,
  }),
  title: z.string().nonempty().openapi({
    description: 'Title of the department',
    example: 'Development',
  }),
})
