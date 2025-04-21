// src/services/state.service.ts

import {
  FindAllStatesResponseDto,
  FindAllStatesResponseDtoType,
} from '@/dtos/state/response/find-all-states-response.dto'
import { UnprocessableEntityError } from '@/errors'
import { StateRepository } from '@/repositories/state/state.repository'

export class StateService {
  constructor(private readonly stateRepository: StateRepository) {}

  async findAll(): Promise<FindAllStatesResponseDtoType> {
    const states = await this.stateRepository.findAll()

    const dataToReturnSchema = FindAllStatesResponseDto.safeParse(states)

    if (!dataToReturnSchema.success)
      throw new UnprocessableEntityError('Invalid data format')

    const dataToReturn = dataToReturnSchema.data

    return dataToReturn
  }
}
