// src/containers/user.container.ts

import { UpdateUserController } from '@/controllers/user/update-user.controller'
import { DepartmentRepository } from '@/repositories/department/department.repository'
import { UserRepository } from '@/repositories/user/user.repository'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'

class UserContainer {
  updateUserController: UpdateUserController

  constructor() {
    // Repository
    const userRepository = new UserRepository()
    const departmentRepository = new DepartmentRepository()

    // Service
    const authService = new AuthService(userRepository, departmentRepository)
    const userService = new UserService(
      userRepository,
      departmentRepository,
      authService,
    )

    // Controller
    this.updateUserController = new UpdateUserController(userService)
  }
}

const userContainer = new UserContainer()

export { userContainer }
