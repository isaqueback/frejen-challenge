// src/entities/state.entity.ts

export type StateEntityTitle =
  | 'PENDING'
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'

export class StateEntity {
  public readonly id!: number
  public readonly title!: StateEntityTitle

  constructor(data: StateEntity) {
    Object.assign(this, data)
  }
}
