// src/routes/ticket.route.ts

import { Request, Response, Router } from 'express'

import { diContainer } from '@/containers'
import { CreateTicketRequestDto } from '@/dtos/ticket/request/create-ticket-request.dto'
import { FindTicketByFiltersRequestDto } from '@/dtos/ticket/request/find-ticket-by-filters-request.dto'
import { FindTicketByIdRequestDto } from '@/dtos/ticket/request/find-ticket-by-id-request.dto'
import { UpdateTicketRequestBodyDto } from '@/dtos/ticket/request/update-ticket-request-body.dto'
import { UpdateTicketRequestParamDto } from '@/dtos/ticket/request/update-ticket-request-param.dto'
import { authenticate } from '@/middlewares/authenticate'
import { validate } from '@/middlewares/validate'
import { RequestTyped } from '@/types/request-typed'

const ticketRouter = Router()
const {
  createTicketController,
  findTicketByIdController,
  findTicketByFiltersController,
  updateTicketController,
} = diContainer.ticket

// POST /tickets
ticketRouter.post(
  '/',
  validate(CreateTicketRequestDto, 'body'),
  authenticate,
  (req: Request, res: Response) =>
    createTicketController.handle(req as RequestTyped, res),
)

// GET /tickets
ticketRouter.get(
  '/',
  validate(FindTicketByFiltersRequestDto, 'query'),
  authenticate,
  (req: Request, res: Response) =>
    findTicketByFiltersController.handle(req as RequestTyped, res),
)

// GET /tickets/:id
ticketRouter.get(
  '/:id',
  validate(FindTicketByIdRequestDto, 'params'),
  authenticate,
  (req: Request, res: Response) =>
    findTicketByIdController.handle(req as RequestTyped, res),
)

// PATCH /tickets/:id
ticketRouter.patch(
  '/:id',
  validate(UpdateTicketRequestParamDto, 'params'),
  validate(UpdateTicketRequestBodyDto, 'body'),
  authenticate,
  (req: Request, res: Response) =>
    updateTicketController.handle(req as RequestTyped, res),
)

export { ticketRouter }
