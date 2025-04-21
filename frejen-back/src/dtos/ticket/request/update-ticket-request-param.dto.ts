// src/dtos/ticket/request/update-ticket-request-param.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const UpdateTicketRequestParamDto = z
  .object({
    id: z.coerce
      .number()
      .int()
      .positive()
      .openapi({ description: 'Ticket ID', example: 1 }),
  })
  .strict()

export type UpdateTicketRequestParamDtoType = z.infer<
  typeof UpdateTicketRequestParamDto
>
