// src/repositories/ticket/ticket-interface.repository.ts

import { TicketEntity } from '@/entities/ticket.entity'
import { UserEntity } from '@/entities/user.entity'
import { MakeSomeRequired } from '@/types/make-some-required'

export type TicketRepositorySaveProps = Omit<
  TicketEntity,
  'id' | 'created_at' | 'updated_at' | 'updated_by' | 'observations'
>

export type TicketRepositoryFindByFilters = {
  search?: string
  ticketStates?: number[]
  lastId: number | null
  limit: number
  include: {
    department: boolean
    state: boolean
  }
  user: UserEntity
}

export type TicketRepositoryFindOneByFilters = {
  search?: string
  ticketStates?: number[]
  lastId: number | null
  user: UserEntity
  order?: [string, 'ASC' | 'DESC'][]
}

export type TickerRepositoryUpdateProps = {
  user: UserEntity
  ticketId: number
  newData: MakeSomeRequired<
    Omit<
      TicketEntity,
      'id' | 'created_at' | 'created_by' | 'department' | 'state'
    >,
    'updated_at' | 'updated_by'
  >
}

export abstract class ITicketRepository {
  abstract save: (props: TicketRepositorySaveProps) => Promise<void>
  abstract findById: (id: number) => Promise<TicketEntity | null>
  abstract findByFilters: (
    props: TicketRepositoryFindByFilters,
  ) => Promise<TicketEntity[]>
  abstract findOneByFilters: (
    props: TicketRepositoryFindOneByFilters,
  ) => Promise<TicketEntity | null>
  abstract update: (
    props: TickerRepositoryUpdateProps,
  ) => Promise<TicketEntity | null>
}
