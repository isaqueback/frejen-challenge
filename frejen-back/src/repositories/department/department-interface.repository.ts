// src/repositories/department/department-interface.repository.ts

import { DepartmentEntity } from '@/entities/department.entity'

export type DepartmentRepositoryFindByFilters = {
  lastId: number | null
  search?: string
  limit: number
}

export type DepartmentRepositoryFindOneByFilters = {
  lastId: number
  search?: string
}

export abstract class IDepartmentRepository {
  abstract findById(id: number): Promise<DepartmentEntity | null>
  abstract findOneByFilters(
    props: DepartmentRepositoryFindOneByFilters,
  ): Promise<DepartmentEntity | null>
  abstract findByFilters(
    props: DepartmentRepositoryFindByFilters,
  ): Promise<DepartmentEntity[]>
}
