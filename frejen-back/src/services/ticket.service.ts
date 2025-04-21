// src/services/ticket.service.ts

import { CreateTicketRequestDtoType } from '@/dtos/ticket/request/create-ticket-request.dto'
import { FindTicketByFiltersRequestDtoType } from '@/dtos/ticket/request/find-ticket-by-filters-request.dto'
import { FindTicketByIdRequestDtoType } from '@/dtos/ticket/request/find-ticket-by-id-request.dto'
import { UpdateTicketRequestBodyDtoType } from '@/dtos/ticket/request/update-ticket-request-body.dto'
import { UpdateTicketRequestParamDtoType } from '@/dtos/ticket/request/update-ticket-request-param.dto'
import {
  FindTicketByFiltersResponseDto,
  FindTicketByFiltersResponseDtoType,
} from '@/dtos/ticket/response/find-ticket-by-filters-response.dto'
import {
  FindTicketByIdResponseDto,
  FindTicketByIdResponseDtoType,
} from '@/dtos/ticket/response/find-ticket-by-id-response.dto'
import { StateEntity, StateEntityTitle } from '@/entities/state.entity'
import { TicketEntity } from '@/entities/ticket.entity'
import { UserEntity } from '@/entities/user.entity'
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from '@/errors'
import { DepartmentRepository } from '@/repositories/department/department.repository'
import { StateRepository } from '@/repositories/state/state.repository'
import { TicketRepository } from '@/repositories/ticket/ticket.repository'
import { TicketRepositorySaveProps } from '@/repositories/ticket/ticket-interface.repository'
import { UserRepository } from '@/repositories/user/user.repository'

type TicketServiceCreateProps = CreateTicketRequestDtoType & {
  user: UserEntity
}

type TicketServiceFindByIdProps = FindTicketByIdRequestDtoType & {
  user: UserEntity
}

type TicketServiceFindByFiltersProps = FindTicketByFiltersRequestDtoType & {
  user: UserEntity
}

type TicketServiceAuthorizeUserToSeeProps = {
  user: UserEntity
  ticket: TicketEntity
}

type TicketServiceCheckHasMoreProps = {
  lastId: number | null
  user: UserEntity
  filters: { search?: string; ticketStates?: number[] }
}

type TicketServiceUpdateProps = UpdateTicketRequestBodyDtoType &
  UpdateTicketRequestParamDtoType & {
    user: UserEntity
  }

type TicketServiceAuthorizeUserToUpdateProps = {
  user: UserEntity
  ticket: TicketEntity
  newObservations?: string | null
  newStateId?: number
}

export class TicketService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly stateRepository: StateRepository,
    private readonly userRepository: UserRepository,
    private readonly departmentRepository: DepartmentRepository,
  ) {}

  async create({
    description,
    id_department,
    title,
    user,
  }: TicketServiceCreateProps): Promise<void> {
    const isIdDepartmentValid =
      await this.departmentRepository.findById(id_department)
    if (!isIdDepartmentValid)
      throw new UnauthorizedError('Department not found')

    const pendingState = await this.stateRepository.findByTitle('PENDING')
    if (!pendingState) throw new UnauthorizedError('State not found')

    const ticketToCreate: TicketRepositorySaveProps = {
      created_by: user.id,
      description,
      id_department,
      id_state: pendingState.id,
      title,
    }

    await this.ticketRepository.save(ticketToCreate)
  }

  async findById({
    id: ticketId,
    user,
  }: TicketServiceFindByIdProps): Promise<FindTicketByIdResponseDtoType> {
    // Ticket
    const ticket = await this.ticketRepository.findById(ticketId)
    if (!ticket) throw new NotFoundError('Ticket not found')

    const isUserAuthorized = this.authorizeUserToSee({ ticket, user })
    if (!isUserAuthorized)
      throw new ForbiddenError('User not authorized to view this ticket')

    // Ticket Creator
    const ticketCreator = await this.userRepository.findById(ticket.created_by)
    if (!ticketCreator) throw new UnauthorizedError('Ticket creator not found')

    // Ticket Creater Department
    const ticketCreatorDepartment = await this.departmentRepository.findById(
      ticketCreator.id_department,
    )
    if (!ticketCreatorDepartment)
      throw new UnauthorizedError('Ticket creator department not found')

    // Ticket Updater
    const ticketUpdater = await this.userRepository.findById(ticket.updated_by)
    if (!ticketUpdater) throw new UnauthorizedError('Ticket updater not found')

    // Ticket Updater Department
    const ticketUpdaterDepartment = await this.departmentRepository.findById(
      ticketUpdater.id_department,
    )
    if (!ticketUpdaterDepartment)
      throw new UnauthorizedError('Ticket updater department not found')

    // Ticket State
    const ticketState = await this.stateRepository.findById(ticket.id_state)
    if (!ticketState) throw new UnauthorizedError('State not found')

    // Ticket Department
    const ticketDepartment = await this.departmentRepository.findById(
      ticket.id_department,
    )
    if (!ticketDepartment) throw new UnauthorizedError('Department not found')

    // User Department
    const userDepartment = await this.departmentRepository.findById(
      user.id_department,
    )
    if (!userDepartment)
      throw new UnauthorizedError('User department not found')

    const dataToReturnSchema = FindTicketByIdResponseDto.safeParse({
      created_at: ticket.created_at,
      created_by: {
        department: {
          id: ticketCreatorDepartment.id,
          title: ticketCreatorDepartment.title,
        },
        email: ticketCreator.email,
        id: ticketCreator.id,
        name: ticketCreator.name,
      },
      description: ticket.description,
      id: ticket.id,
      observations: ticket.observations,
      state: {
        id: ticketState.id,
        title: ticketState.title,
      },
      ticketDepartment: {
        id: ticketDepartment.id,
        title: ticketDepartment.title,
      },
      title: ticket.title,
      updated_at: ticket.updated_at,
      updated_by: {
        department: {
          id: ticketUpdaterDepartment.id,
          title: ticketUpdaterDepartment.title,
        },
        email: ticketUpdater.email,
        id: ticketUpdater.id,
        name: ticketUpdater.name,
      },
    })
    if (!dataToReturnSchema.success)
      throw new UnauthorizedError('Invalid data to return')

    const dataToReturn = dataToReturnSchema.data
    return dataToReturn
  }

  async findByFilters({
    lastId,
    search,
    ticketStates,
    user,
  }: TicketServiceFindByFiltersProps): Promise<FindTicketByFiltersResponseDtoType> {
    const limit = 2

    const tickets = await this.ticketRepository.findByFilters({
      include: { department: true, state: true },
      lastId,
      limit,
      search,
      ticketStates,
      user,
    })

    const hasMore = await this.checkHasMore({
      filters: { search, ticketStates },
      lastId: tickets.at(-1)?.id ?? null,
      user,
    })

    const dataToReturnSchema = FindTicketByFiltersResponseDto.safeParse({
      hasMore,
      tickets,
    })

    if (!dataToReturnSchema.success) {
      throw new UnauthorizedError('Invalid data to return')
    }

    return dataToReturnSchema.data
  }

  async update({
    id: ticketId,
    newStateId,
    user,
    newDepartmentId,
    newDescription,
    newObservations,
    newTitle,
  }: TicketServiceUpdateProps): Promise<void> {
    const ticketToUpdate = await this.ticketRepository.findById(ticketId)
    if (!ticketToUpdate) throw new NotFoundError('Ticket not found')

    await this.authorizeUserToUpdate({
      newObservations,
      newStateId,
      ticket: ticketToUpdate,
      user,
    })

    const updatedTicket = await this.ticketRepository.update({
      newData: {
        description: newDescription,
        id_department: newDepartmentId,
        id_state: newStateId,
        observations: newObservations,
        title: newTitle,
        updated_at: new Date(),
        updated_by: user.id,
      },
      ticketId,
      user,
    })

    if (!updatedTicket) throw new BadRequestError('No data has been updated')
  }

  private authorizeUserToSee({
    ticket,
    user,
  }: TicketServiceAuthorizeUserToSeeProps): boolean {
    const isAuthorized =
      user.admin ||
      ticket.created_by === user.id ||
      user.id_department === ticket.id_department

    return isAuthorized
  }

  private async checkHasMore({
    filters,
    lastId,
    user,
  }: TicketServiceCheckHasMoreProps): Promise<boolean> {
    if (!lastId) return false

    const nextTicket = await this.ticketRepository.findOneByFilters({
      lastId,
      search: filters.search,
      ticketStates: filters.ticketStates,
      user,
    })

    return !!nextTicket
  }

  private async authorizeUserToUpdate({
    ticket,
    user,
    newObservations,
    newStateId,
  }: TicketServiceAuthorizeUserToUpdateProps): Promise<void> {
    const isAuthorized =
      user.admin ||
      ticket.created_by === user.id ||
      user.id_department === ticket.id_department

    if (!isAuthorized) {
      throw new UnauthorizedError('User not authorized to update this ticket')
    }

    const ticketState = await this.stateRepository.findById(ticket.id_state)
    const isTicketRejectedOrCompleted =
      ticketState?.title === 'REJECTED' || ticketState?.title === 'COMPLETED'

    if (isTicketRejectedOrCompleted) {
      throw new ForbiddenError('Cannot update a rejected or completed ticket')
    }

    if (newStateId) {
      const newState = await this.stateRepository.findById(newStateId)
      if (!newState) throw new UnauthorizedError('State not found')

      if (newState.title === 'REJECTED' && !newObservations) {
        throw new UnprocessableEntityError(
          'Observations are required to reject the ticket',
        )
      }
    }
  }
}
