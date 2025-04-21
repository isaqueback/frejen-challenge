// src/dtos/ticket/request/create-ticket-request.dto.ts

import { z } from 'zod'

export const CreateTicketRequestDto = z
  .object({
    description: z.string().nonempty().openapi({
      description: 'Description of the ticket',
      example: 'Ticket Description',
    }),
    id_department: z.number().int().positive().openapi({
      description: 'ID of the department',
      example: 1,
    }),
    title: z
      .string()
      .nonempty()
      .openapi({ description: 'Title of the ticket', example: 'Ticket Title' }),
  })
  .strict()
  .openapi({
    description: 'Request body for creating a new ticket',
    required: ['description', 'id_department', 'title'],
    title: 'CreateTicketRequestDto',
  })

export type CreateTicketRequestDtoType = z.infer<typeof CreateTicketRequestDto>
