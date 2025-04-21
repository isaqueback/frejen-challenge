// src/controllers/department/find-ticket-by-filters.controller.ts

import { Response } from 'express'

import { HttpStatus } from '@/constants/http-status.constant'
import { FindDepartmentByFiltersRequestDtoType } from '@/dtos/department/request/find-department-by-filters-request.dto'
import { DepartmentService } from '@/services/department.service'
import { RequestTyped } from '@/types/request-typed'

export class FindDepartmentByFiltersController {
  constructor(private readonly departmentService: DepartmentService) {}

  async handle(req: RequestTyped, res: Response): Promise<void> {
    const { lastId, search } =
      req.validatedQuery as FindDepartmentByFiltersRequestDtoType

    const departments = await this.departmentService.findByFilters({
      lastId,
      search,
    })

    res.status(HttpStatus.OK).json(departments)
  }
}
