// src/dtos/department/request/find-department-by-filters-request.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'
extendZodWithOpenApi(z)

export const FindDepartmentByFiltersRequestDto = z.object({
  lastId: z.coerce.number().int().positive().nullable().default(null).openapi({
    description: 'ID of the last department',
    example: 1,
  }),
  search: z.string().optional().openapi({
    description: 'Search term for department title',
    example: 'Development',
  }),
})

export type FindDepartmentByFiltersRequestDtoType = z.infer<
  typeof FindDepartmentByFiltersRequestDto
>
