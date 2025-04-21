// src/dtos/ticket/request/find-ticket-by-filters-request.dto.ts

import { z } from 'zod'

export const FindTicketByFiltersRequestDto = z
  .object({
    lastId: z.coerce
      .number()
      .int()
      .positive()
      .nullable()
      .default(null)
      .openapi({
        description: 'ID of the last ticket retrieved for pagination',
        example: 10,
      }),
    // page: z.coerce.number().int().min(1).default(1).openapi({
    //   description: 'Page number for pagination',
    //   example: 1,
    // }),
    search: z.string().optional().openapi({
      description: 'Search term for ticket title or description',
      example: 'example search',
    }),
    ticketStates: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (val) {
            const splitValues = val
              .split(',')
              .map((item) => parseInt(item.trim(), 10))
            return splitValues.every((item) => !isNaN(item))
          }
          return true
        },
        {
          message: 'Invalid ticketStates format',
        },
      )
      .transform((val) => {
        return val
          ? val.split(',').map((item) => parseInt(item.trim(), 10))
          : []
      })
      .openapi({
        description: 'Array of ticket state IDs to filter by',
        example: '1,2,3',
      }),
  })
  .strict()

export type FindTicketByFiltersRequestDtoType = z.infer<
  typeof FindTicketByFiltersRequestDto
>
