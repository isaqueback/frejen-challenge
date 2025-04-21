// src/dtos/department/response/find-department-by-filters-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'
extendZodWithOpenApi(z)

export const FindDepartmentByFiltersResponseDto = z.object({
  departments: z.array(
    z.object({
      id: z.number().int().positive().openapi({
        description: 'ID of the department',
        example: 1,
      }),
      title: z.string().nonempty().openapi({
        description: 'Title of the department',
        example: 'Development',
      }),
    }),
  ),
  hasMore: z.boolean().openapi({
    description: 'Indicates if there are more departments to load',
    example: true,
  }),
})

export type FindDepartmentByFiltersResponseDtoType = z.infer<
  typeof FindDepartmentByFiltersResponseDto
>
