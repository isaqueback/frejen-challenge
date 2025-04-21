// src/entities/ticket.entity.ts

import { DepartmentEntity } from './department.entity'
import { StateEntity } from './state.entity'

export class TicketEntity {
  public readonly id!: number
  public title!: string
  public description!: string
  public readonly created_at!: Date
  public updated_at!: Date
  public readonly created_by!: number
  public updated_by!: number
  public id_state!: number
  public id_department!: number
  public observations!: string | null
  public department?: DepartmentEntity
  public state?: StateEntity

  constructor(data: TicketEntity) {
    Object.assign(this, data)
  }
}
