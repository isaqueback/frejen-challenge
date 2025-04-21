// src/containers/state.container.ts

import { FindAllStatesController } from '@/controllers/state/find-all-states.controller'
import { StateRepository } from '@/repositories/state/state.repository'
import { StateService } from '@/services/state.service'

class StateContainer {
  findAllStatesController: FindAllStatesController

  constructor() {
    // Repository
    const stateRepository = new StateRepository()

    // Service
    const stateService = new StateService(stateRepository)

    // Controller
    this.findAllStatesController = new FindAllStatesController(stateService)
  }
}

const stateContainer = new StateContainer()

export { stateContainer }
