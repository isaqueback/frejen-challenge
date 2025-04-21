// src/containers/auth.container.ts

import { MeController } from '@/controllers/auth/me.controller'
import { SignInController } from '@/controllers/auth/sign-in.controller'
import { SignOutController } from '@/controllers/auth/sign-out.controller'
import { SignUpController } from '@/controllers/auth/sign-up.controller'
import { DepartmentRepository } from '@/repositories/department/department.repository'
import { UserRepository } from '@/repositories/user/user.repository'
import { AuthService } from '@/services/auth.service'

export class AuthContainer {
  signInController: SignInController
  signUpController: SignUpController
  signOutController: SignOutController
  meController: MeController

  constructor() {
    // Repositories
    const userRepository = new UserRepository()
    const departmentRepository = new DepartmentRepository()

    // Services
    const authService = new AuthService(userRepository, departmentRepository)

    // Controllers
    this.signInController = new SignInController(authService)
    this.signUpController = new SignUpController(authService)
    this.signOutController = new SignOutController()
    this.meController = new MeController()
  }
}

const authContainer = new AuthContainer()

export { authContainer }
