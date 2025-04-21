// src/dtos/state/state-schema.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const StateSchema = z.object({
  id: z.number().int().positive().openapi({
    description: 'ID of the state',
    example: 1,
  }),
  title: z.enum(['PENDING', 'REJECTED', 'IN_PROGRESS', 'COMPLETED']).openapi({
    description: 'Title of the state',
    example: 'IN_PROGRESS',
  }),
})
