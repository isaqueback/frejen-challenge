// src/controllers/ticket/create-ticket.controller.ts

import { Response } from 'express'

import { HttpStatus } from '@/constants/http-status.constant'
import { TicketService } from '@/services/ticket.service'
import { RequestTyped } from '@/types/request-typed'

export class CreateTicketController {
  constructor(private readonly ticketService: TicketService) {}

  async handle(req: RequestTyped, res: Response): Promise<void> {
    const user = req.user
    const bodyParsed = req.body

    await this.ticketService.create({
      ...bodyParsed,
      user,
    })

    res.status(HttpStatus.CREATED).json()
  }
}
