// src/dtos/ticket/request/find-ticket-by-id-request.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const FindTicketByIdRequestDto = z
  .object({
    id: z.coerce.number().int().positive().openapi({
      description: 'The ID of the ticket to find',
      example: 1,
    }),
  })
  .strict()

export type FindTicketByIdRequestDtoType = z.infer<
  typeof FindTicketByIdRequestDto
>
