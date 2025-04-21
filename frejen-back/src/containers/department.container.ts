// src/containers/department.container.ts

import { FindDepartmentByFiltersController } from '@/controllers/department/find-ticket-by-filters.controller'
import { DepartmentRepository } from '@/repositories/department/department.repository'
import { DepartmentService } from '@/services/department.service'

class DepartmentContainer {
  findDepartmentByFiltersController: FindDepartmentByFiltersController

  constructor() {
    // Repository
    const departmentRepository = new DepartmentRepository()

    // Service
    const departmentService = new DepartmentService(departmentRepository)

    // Controller
    this.findDepartmentByFiltersController =
      new FindDepartmentByFiltersController(departmentService)
  }
}

const departmentContainer = new DepartmentContainer()

export { departmentContainer }
