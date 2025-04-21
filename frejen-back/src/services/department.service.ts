// src/services/department.service.ts

import { FindDepartmentByFiltersRequestDtoType } from '@/dtos/department/request/find-department-by-filters-request.dto'
import {
  FindDepartmentByFiltersResponseDto,
  FindDepartmentByFiltersResponseDtoType,
} from '@/dtos/department/response/find-department-by-filters-response.dto'
import { UnprocessableEntityError } from '@/errors'
import { DepartmentRepository } from '@/repositories/department/department.repository'

type DepartmentServiceCheckHasMoreProps = {
  lastId: number | null
  search?: string
}

export class DepartmentService {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async findByFilters({
    lastId,
    search,
  }: FindDepartmentByFiltersRequestDtoType): Promise<FindDepartmentByFiltersResponseDtoType> {
    const limit = 10

    const departments = await this.departmentRepository.findByFilters({
      lastId,
      limit,
      search,
    })

    const hasMore = await this.checkHasMore({
      lastId: departments.at(-1)?.id ?? null,
      search,
    })

    const dataToReturnSchema = FindDepartmentByFiltersResponseDto.safeParse({
      departments,
      hasMore,
    })
    if (!dataToReturnSchema.success) {
      throw new UnprocessableEntityError('Invalid data format')
    }

    const dataToReturn = dataToReturnSchema.data

    return dataToReturn
  }

  private async checkHasMore({
    lastId,
    search,
  }: DepartmentServiceCheckHasMoreProps): Promise<boolean> {
    if (!lastId) return false

    const nextDepartment = await this.departmentRepository.findOneByFilters({
      lastId,
      search,
    })

    return !!nextDepartment
  }
}
