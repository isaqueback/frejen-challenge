// src/repositories/state/state.repository.ts

import { db } from '@/database/models'
import { StateEntity, StateEntityTitle } from '@/entities/state.entity'
import { InternalServerError } from '@/errors'

import { IStateRepository } from './state-interface.repository'

export class StateRepository implements IStateRepository {
  async findAll(): Promise<StateEntity[]> {
    try {
      const states = await db.state.findAll()

      return states.map(
        (state) => new StateEntity({ id: state.id, title: state.title }),
      )
    } catch {
      throw new InternalServerError(
        'DATABASE: Error while searching for states',
      )
    }
  }

  async findById(id: number): Promise<StateEntity | null> {
    try {
      const state = await db.state.findByPk(id)

      if (!state) return null

      return new StateEntity({
        id: state.id,
        title: state.title,
      })
    } catch {
      throw new InternalServerError(
        'DATABASE: Error while searching for state by id',
      )
    }
  }

  async findByTitle(title: StateEntityTitle): Promise<StateEntity | null> {
    try {
      const state = await db.state.findOne({ where: { title } })

      if (!state) return null

      return new StateEntity({
        id: state.id,
        title: state.title,
      })
    } catch {
      throw new InternalServerError(
        'DATABASE: Error while searching for state by title',
      )
    }
  }
}
