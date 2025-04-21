// src/controllers/ticket/find-ticket-by-filters.controller.ts

import { Response } from 'express'

import { HttpStatus } from '@/constants/http-status.constant'
import { FindTicketByFiltersRequestDtoType } from '@/dtos/ticket/request/find-ticket-by-filters-request.dto'
import { TicketService } from '@/services/ticket.service'
import { RequestTyped } from '@/types/request-typed'

export class FindTicketByFiltersController {
  constructor(private readonly ticketService: TicketService) {}

  async handle(req: RequestTyped, res: Response): Promise<void> {
    const user = req.user
    const { search, ticketStates, lastId } =
      req.validatedQuery as FindTicketByFiltersRequestDtoType

    const tickets = await this.ticketService.findByFilters({
      lastId,
      search,
      ticketStates,
      user,
    })
    res.status(HttpStatus.OK).json(tickets)
  }
}
