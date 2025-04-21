// src/dtos/state/response/find-all-states-response.dto.ts

import z from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const FindAllStatesResponseDto = z.array(
  z.object({
    id: z
      .number()
      .int()
      .positive()
      .openapi({ description: 'State ID', example: 1 }),
    title: z.enum(['PENDING', 'REJECTED', 'IN_PROGRESS', 'COMPLETED']).openapi({
      description: 'State title',
      example: 'PENDING',
    }),
  }),
)

export type FindAllStatesResponseDtoType = z.infer<
  typeof FindAllStatesResponseDto
>
