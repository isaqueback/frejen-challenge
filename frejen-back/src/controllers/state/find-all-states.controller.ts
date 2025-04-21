// src/controllers/state/find-all-states.controller.ts

import { Response } from 'express'

import { HttpStatus } from '@/constants/http-status.constant'
import { StateService } from '@/services/state.service'
import { RequestTyped } from '@/types/request-typed'

export class FindAllStatesController {
  constructor(private readonly stateService: StateService) {}

  async handle(req: RequestTyped, res: Response): Promise<void> {
    const states = await this.stateService.findAll()

    res.status(HttpStatus.OK).json(states)
  }
}
