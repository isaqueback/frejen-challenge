// src/repositories/ticket/ticket.repository.ts

import { Includeable, IncludeOptions, Op, WhereOptions } from 'sequelize'

import { db } from '@/database/models'
import { TicketAttributes } from '@/database/models/ticket.model'
import { DepartmentEntity } from '@/entities/department.entity'
import { StateEntity } from '@/entities/state.entity'
import { TicketEntity } from '@/entities/ticket.entity'
import { InternalServerError } from '@/errors'

import {
  ITicketRepository,
  TickerRepositoryUpdateProps,
  TicketRepositoryFindByFilters,
  TicketRepositoryFindOneByFilters,
  TicketRepositorySaveProps,
} from './ticket-interface.repository'

export class TicketRepository implements ITicketRepository {
  async save({
    description,
    id_department,
    title,
    created_by,
    id_state,
  }: TicketRepositorySaveProps): Promise<void> {
    try {
      await db.ticket.create({
        created_at: new Date(),
        created_by,
        description,
        id_department,
        id_state,
        observations: null,
        title,
        updated_at: new Date(),
        updated_by: created_by,
      })
    } catch {
      throw new InternalServerError(
        'DATABASE: Error while saving ticket in the database',
      )
    }
  }

  async findById(id: number): Promise<TicketEntity | null> {
    try {
      const ticket = await db.ticket.findByPk(id)

      if (!ticket) return null

      return new TicketEntity({
        created_at: ticket.created_at,
        created_by: ticket.created_by,
        description: ticket.description,
        id: ticket.id,
        id_department: ticket.id_department,
        id_state: ticket.id_state,
        observations: ticket.observations,
        title: ticket.title,
        updated_at: ticket.updated_at,
        updated_by: ticket.updated_by,
      })
    } catch {
      throw new InternalServerError(
        'DATABASE: Error while finding ticket by id in the database',
      )
    }
  }

  async findByFilters({
    search,
    ticketStates,
    limit = 10,
    lastId,
    include: { department = false, state = false },
    user,
  }: TicketRepositoryFindByFilters): Promise<TicketEntity[]> {
    try {
      const filters: WhereOptions<TicketAttributes> = {}

      if (ticketStates?.length) {
        filters.id_state = {
          [Op.in]: ticketStates,
        }
      }

      if (search) {
        Object.assign(filters, {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
            { observations: { [Op.like]: `%${search}%` } },
          ],
        })
      }

      // Authorization filter
      const userFilters: WhereOptions<TicketAttributes> = {}

      if (!user.admin) {
        Object.assign(userFilters, {
          [Op.or]: [
            { created_by: user.id },
            { id_department: user.id_department },
          ],
        })
      }

      // Filter by last ID (for lazy loading)
      const whereCondition = lastId
        ? {
            id: { [Op.lt]: lastId },
            ...userFilters,
            ...filters,
          }
        : {
            ...userFilters,
            ...filters,
          }

      const includeOptions: Includeable[] = []

      if (department) {
        includeOptions.push({
          as: 'department',
          model: db.department,
        })
      }

      if (state) {
        includeOptions.push({
          as: 'state',
          model: db.state,
        })
      }

      const tickets = await db.ticket.findAll({
        include: includeOptions,
        limit,
        order: [['id', 'DESC']],
        where: whereCondition,
      })

      return tickets.map(
        (ticket) =>
          new TicketEntity({
            created_at: ticket.created_at,
            created_by: ticket.created_by,
            department: ticket.department
              ? new DepartmentEntity({
                  id: ticket.department.id,
                  title: ticket.department.title,
                })
              : undefined,
            description: ticket.description,
            id: ticket.id,
            id_department: ticket.id_department,
            id_state: ticket.id_state,
            observations: ticket.observations,
            state: ticket.state
              ? new StateEntity({
                  id: ticket.state.id,
                  title: ticket.state.title,
                })
              : undefined,
            title: ticket.title,
            updated_at: ticket.updated_at,
            updated_by: ticket.updated_by,
          }),
      )
    } catch {
      throw new InternalServerError(
        'DATABASE: Error while finding tickets by filters in the database',
      )
    }
  }

  async findOneByFilters({
    lastId,
    user,
    order = [['id', 'DESC']],
    search,
    ticketStates,
  }: TicketRepositoryFindOneByFilters): Promise<TicketEntity | null> {
    try {
      const filters: WhereOptions<TicketAttributes> = lastId
        ? { id: { [Op.lt]: lastId } }
        : {}

      if (ticketStates?.length) {
        filters.id_state = {
          [Op.in]: ticketStates,
        }
      }

      const orConditions: WhereOptions<TicketAttributes>[] = []

      if (search) {
        orConditions.push({
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
            { observations: { [Op.like]: `%${search}%` } },
          ],
        })
      }

      if (!user.admin) {
        orConditions.push({
          [Op.or]: [
            { created_by: user.id },
            { id_department: user.id_department },
          ],
        })
      }

      const where: WhereOptions<TicketAttributes> =
        orConditions.length > 0
          ? {
              ...filters,
              [Op.and]: orConditions,
            }
          : filters

      const ticket = await db.ticket.findOne({
        order,
        where,
      })

      if (!ticket) return null

      return new TicketEntity({
        created_at: ticket.created_at,
        created_by: ticket.created_by,
        description: ticket.description,
        id: ticket.id,
        id_department: ticket.id_department,
        id_state: ticket.id_state,
        observations: ticket.observations,
        title: ticket.title,
        updated_at: ticket.updated_at,
        updated_by: ticket.updated_by,
      })
    } catch {
      throw new InternalServerError(
        'DATABASE: Error while finding one ticket by filters',
      )
    }
  }

  async update({
    newData,
    ticketId,
    user,
  }: TickerRepositoryUpdateProps): Promise<TicketEntity | null> {
    try {
      const updateData: Record<string, any> = {}

      if (newData.title !== undefined) updateData.title = newData.title
      if (newData.description !== undefined)
        updateData.description = newData.description
      if (newData.id_state !== undefined) updateData.id_state = newData.id_state
      if (newData.id_department !== undefined)
        updateData.id_department = newData.id_department
      if (newData.observations !== undefined)
        updateData.observations = newData.observations

      const hasSomethingToUpdate = Object.keys(updateData).length > 0

      if (!hasSomethingToUpdate) return null

      updateData.updated_at = newData.updated_at || new Date()
      updateData.updated_by = newData.updated_by || user.id

      const [affectedCount] = await db.ticket.update(updateData, {
        where: { id: ticketId },
      })

      if (affectedCount === 0) return null

      const updatedTicket = await db.ticket.findOne({ where: { id: ticketId } })
      if (!updatedTicket) return null

      return new TicketEntity({
        created_at: updatedTicket.created_at,
        created_by: updatedTicket.created_by,
        description: updatedTicket.description,
        id: updatedTicket.id,
        id_department: updatedTicket.id_department,
        id_state: updatedTicket.id_state,
        observations: updatedTicket.observations,
        title: updatedTicket.title,
        updated_at: updatedTicket.updated_at,
        updated_by: updatedTicket.updated_by,
      })
    } catch {
      throw new InternalServerError('DATABASE: Error while updating ticket')
    }
  }
}
