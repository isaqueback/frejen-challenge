// src/database/models/index.ts

import { DepartmentModel } from './department.model'
import { StateModel } from './state.model'
import { TicketModel } from './ticket.model'
import { UserModel } from './user.model'

export const db = {
  department: DepartmentModel,
  state: StateModel,
  ticket: TicketModel,
  user: UserModel,
}
