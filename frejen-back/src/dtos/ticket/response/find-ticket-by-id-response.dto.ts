// src/dtos/ticket/response/find-ticket-by-id-response.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

import { DepartmentSchema } from '@/dtos/department/department-schema'
import { StateSchema } from '@/dtos/state/state-schema'
import { UserSchema } from '@/dtos/user/user-schema'

extendZodWithOpenApi(z)

export const FindTicketByIdResponseDto = z.object({
  created_at: z.coerce.date().openapi({
    description: 'Date when the ticket was created',
    example: '2023-10-01T12:00:00Z',
  }),
  created_by: UserSchema,
  description: z.string().nonempty().openapi({
    description: 'Description of the ticket',
    example: 'Ticket Description',
  }),
  id: z.number().int().positive().openapi({
    description: 'ID of the ticket',
    example: 1,
  }),
  observations: z.string().nullable().openapi({
    description: 'Observations related to the ticket',
    example: null,
  }),
  state: StateSchema,
  ticketDepartment: DepartmentSchema,
  title: z.string().nonempty().openapi({
    description: 'Title of the ticket',
    example: 'Ticket Title',
  }),
  updated_at: z.coerce.date().openapi({
    description: 'Date when the ticket was last updated',
    example: '2023-10-01T12:00:00Z',
  }),
  updated_by: UserSchema,
})

export type FindTicketByIdResponseDtoType = z.infer<
  typeof FindTicketByIdResponseDto
>
