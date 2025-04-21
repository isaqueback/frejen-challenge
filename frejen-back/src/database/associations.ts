// src/database/associations.ts

import { DepartmentModel } from './models/department.model'
import { StateModel } from './models/state.model'
import { TicketModel } from './models/ticket.model'
import { UserModel } from './models/user.model'

export const setupAssociations = () => {
  // User -> Department (M:1)
  UserModel.belongsTo(DepartmentModel, {
    as: 'department',
    foreignKey: 'id_department',
  })
  DepartmentModel.hasMany(UserModel, {
    as: 'users',
    foreignKey: 'id_department',
  })

  // Ticket -> Department (M:1)
  TicketModel.belongsTo(DepartmentModel, {
    as: 'department',
    foreignKey: 'id_department',
  })
  DepartmentModel.hasMany(TicketModel, {
    as: 'tickets',
    foreignKey: 'id_department',
  })

  // Ticket -> State (M:1)
  TicketModel.belongsTo(StateModel, {
    as: 'state',
    foreignKey: 'id_state',
  })
  StateModel.hasMany(TicketModel, {
    as: 'tickets',
    foreignKey: 'id_state',
  })

  // Ticket -> User (created_by e updated_by)
  TicketModel.belongsTo(UserModel, {
    as: 'creator',
    foreignKey: 'created_by',
  })
  TicketModel.belongsTo(UserModel, {
    as: 'updater',
    foreignKey: 'updated_by',
  })
  UserModel.hasMany(TicketModel, {
    as: 'createdTickets',
    foreignKey: 'created_by',
  })
  UserModel.hasMany(TicketModel, {
    as: 'updatedTickets',
    foreignKey: 'updated_by',
  })
}
