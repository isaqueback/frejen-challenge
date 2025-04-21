// src/controllers/ticket/find-ticket-by-id.controller.ts

import { Response } from 'express'

import { HttpStatus } from '@/constants/http-status.constant'
import { TicketService } from '@/services/ticket.service'
import { RequestTyped } from '@/types/request-typed'

export class FindTicketByIdController {
  constructor(private readonly ticketService: TicketService) {}

  async handle(req: RequestTyped, res: Response): Promise<void> {
    const ticketId = Number(req.params.id)
    const user = req.user
    const ticket = await this.ticketService.findById({
      id: ticketId,
      user,
    })

    res.status(HttpStatus.OK).json(ticket)
  }
}
