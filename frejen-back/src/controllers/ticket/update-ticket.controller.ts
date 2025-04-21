// src/controllers/ticket/update-ticket.controller.ts

import { Response } from 'express'

import { HttpStatus } from '@/constants/http-status.constant'
import { TicketService } from '@/services/ticket.service'
import { RequestTyped } from '@/types/request-typed'

export class UpdateTicketController {
  constructor(private readonly ticketService: TicketService) {}

  async handle(req: RequestTyped, res: Response): Promise<void> {
    const id = Number(req.params.id)
    const user = req.user

    const bodyParsed = req.body

    await this.ticketService.update({ id, user, ...bodyParsed })

    res.status(HttpStatus.NO_CONTENT).json()
  }
}
