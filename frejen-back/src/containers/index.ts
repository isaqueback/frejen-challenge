// src/containers/index.ts

import { authContainer } from './auth.container'
import { departmentContainer } from './department.container'
import { stateContainer } from './state.container'
import { ticketContainer } from './ticket.container'
import { userContainer } from './user.container'

export const diContainer = {
  auth: authContainer,
  department: departmentContainer,
  state: stateContainer,
  ticket: ticketContainer,
  user: userContainer,
}
