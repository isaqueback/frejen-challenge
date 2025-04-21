// src/routes/department.route.ts

import { Router } from 'express'
import { Request, Response } from 'express'

import { diContainer } from '@/containers'
import { FindDepartmentByFiltersRequestDto } from '@/dtos/department/request/find-department-by-filters-request.dto'
import { validate } from '@/middlewares/validate'
import { RequestTyped } from '@/types/request-typed'

const { findDepartmentByFiltersController } = diContainer.department

const departmentRouter = Router()

// GET /departments
departmentRouter.get(
  '/',
  validate(FindDepartmentByFiltersRequestDto, 'query'),
  (req: Request, res: Response) =>
    findDepartmentByFiltersController.handle(req as RequestTyped, res),
)

export { departmentRouter }
