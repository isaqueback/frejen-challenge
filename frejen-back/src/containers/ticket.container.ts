// src/containers/ticket.container.ts

import { CreateTicketController } from '@/controllers/ticket/create-ticket.controller'
import { FindTicketByFiltersController } from '@/controllers/ticket/find-ticket-by-filters.controller'
import { FindTicketByIdController } from '@/controllers/ticket/find-ticket-by-id.controller'
import { UpdateTicketController } from '@/controllers/ticket/update-ticket.controller'
import { DepartmentRepository } from '@/repositories/department/department.repository'
import { StateRepository } from '@/repositories/state/state.repository'
import { TicketRepository } from '@/repositories/ticket/ticket.repository'
import { UserRepository } from '@/repositories/user/user.repository'
import { TicketService } from '@/services/ticket.service'

class TicketContainer {
  createTicketController: CreateTicketController
  findTicketByIdController: FindTicketByIdController
  findTicketByFiltersController: FindTicketByFiltersController
  updateTicketController: UpdateTicketController

  constructor() {
    // Repositories
    const ticketRepository = new TicketRepository()
    const stateRepository = new StateRepository()
    const userRepository = new UserRepository()
    const departmentRepository = new DepartmentRepository()

    // Services
    const ticketService = new TicketService(
      ticketRepository,
      stateRepository,
      userRepository,
      departmentRepository,
    )

    // Controllers
    this.createTicketController = new CreateTicketController(ticketService)
    this.findTicketByIdController = new FindTicketByIdController(ticketService)
    this.findTicketByFiltersController = new FindTicketByFiltersController(
      ticketService,
    )
    this.updateTicketController = new UpdateTicketController(ticketService)
  }
}

const ticketContainer = new TicketContainer()

export { ticketContainer }
