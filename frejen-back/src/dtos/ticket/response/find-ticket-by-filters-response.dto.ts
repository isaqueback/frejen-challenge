// src/dtos/ticket/response/find-ticket-by-filters-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

import { DepartmentSchema } from '@/dtos/department/department-schema'
import { StateSchema } from '@/dtos/state/state-schema'

extendZodWithOpenApi(z)

export const FindTicketByFiltersResponseDto = z.object({
  hasMore: z.boolean().openapi({
    description: 'Indicates if there are more tickets available',
    example: true,
  }),
  tickets: z.array(
    z.object({
      created_at: z.coerce.date().openapi({
        description: 'Creation date of the ticket',
        example: '2023-10-01T12:00:00Z',
      }),
      department: DepartmentSchema,
      description: z.string().nonempty().openapi({
        description: 'Description of the ticket',
        example: 'Ticket Description',
      }),
      id: z.number().int().positive().openapi({
        description: 'Unique identifier of the ticket',
        example: 1,
      }),
      observations: z.string().nonempty().nullable().openapi({
        description: 'Observations of the ticket',
        example: 'Ticket Observations',
      }),
      state: StateSchema,
      title: z.string().nonempty().openapi({
        description: 'Title of the ticket',
        example: 'Ticket Title',
      }),
      updated_at: z.coerce.date().openapi({
        description: 'Last update date of the ticket',
        example: '2023-10-01T12:00:00Z',
      }),
    }),
  ),
})

export type FindTicketByFiltersResponseDtoType = z.infer<
  typeof FindTicketByFiltersResponseDto
>
