// src/repositories/state/state-interface.repository.ts

import { StateEntity, StateEntityTitle } from '@/entities/state.entity'

export abstract class IStateRepository {
  abstract findById(id: number): Promise<StateEntity | null>
  abstract findByTitle(title: StateEntityTitle): Promise<StateEntity | null>
  abstract findAll(): Promise<StateEntity[]>
}
