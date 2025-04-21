// src/dtos/ticket/request/update-ticket-request-body.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

import { StateSchema } from '@/dtos/state/state-schema'

extendZodWithOpenApi(z)

export const UpdateTicketRequestBodyDto = z
  .object({
    newDepartmentId: z
      .number()
      .int()
      .positive()
      .optional()
      .openapi({ description: 'Department ID', example: 1 }),
    newDescription: z.string().nonempty().optional().openapi({
      description: 'Ticket description',
      example: 'Sample Description',
    }),
    newObservations: z.string().optional().nullable().openapi({
      description: 'Ticket observations',
      example: 'Sample Observations',
    }),
    newStateId: z.number().int().positive().optional().openapi({
      description: 'State ID',
      example: 1,
    }),
    newTitle: z
      .string()
      .nonempty()
      .optional()
      .openapi({ description: 'Ticket title', example: 'Sample Ticket Title' }),
  })
  .strict()

export type UpdateTicketRequestBodyDtoType = z.infer<
  typeof UpdateTicketRequestBodyDto
>
