// src/repositories/department/department.repository.ts

import { col, fn, Op, where as sequelizeWhere, WhereOptions } from 'sequelize'

import { db } from '@/database/models'
import {
  DepartmentAttributes,
  DepartmentInstance,
} from '@/database/models/department.model'
import { DepartmentEntity } from '@/entities/department.entity'
import { InternalServerError } from '@/errors'

import {
  DepartmentRepositoryFindByFilters,
  DepartmentRepositoryFindOneByFilters,
  IDepartmentRepository,
} from './department-interface.repository'

export class DepartmentRepository implements IDepartmentRepository {
  async findById(id: number): Promise<DepartmentEntity | null> {
    try {
      const department = await db.department.findByPk(id)

      if (!department) return null

      return new DepartmentEntity({
        id: department.id,
        title: department.title,
      })
    } catch {
      throw new InternalServerError(
        'DATABASE: Error while fetching department by ID',
      )
    }
  }

  async findOneByFilters({
    lastId,
    search,
  }: DepartmentRepositoryFindOneByFilters): Promise<DepartmentEntity | null> {
    try {
      const filters: WhereOptions<DepartmentAttributes> = lastId
        ? { id: { [Op.gt]: lastId } } // usamos Op.gt pra "ver se há mais"
        : {}

      const andConditions: WhereOptions<DepartmentAttributes>[] = []

      if (search) {
        andConditions.push(
          sequelizeWhere(fn('LOWER', col('title')), {
            [Op.like]: `%${search.toLowerCase()}%`,
          }),
        )
      }

      const where: WhereOptions<DepartmentAttributes> =
        andConditions.length > 0
          ? {
              ...filters,
              [Op.and]: andConditions,
            }
          : filters

      const department = await db.department.findOne({
        order: [['id', 'ASC']],
        where,
      })

      if (!department) return null

      return new DepartmentEntity({
        id: department.id,
        title: department.title,
      })
    } catch {
      throw new InternalServerError(
        'DATABASE: Error while finding one department by filters',
      )
    }
  }

  async findByFilters({
    lastId,
    limit,
    search,
  }: DepartmentRepositoryFindByFilters): Promise<DepartmentEntity[]> {
    try {
      const whereBase: WhereOptions<DepartmentAttributes> = {}

      if (lastId !== null) {
        whereBase.id = { [Op.gt]: lastId }
      }

      const whereSearch = search
        ? ({
            [Op.and]: [
              sequelizeWhere(fn('LOWER', col('title')), {
                [Op.like]: `%${search.toLowerCase()}%`,
              }),
            ],
          } as any)
        : {}

      const where = Object.assign({}, whereBase, whereSearch)

      const departments = await db.department.findAll({
        limit,
        order: [['id', 'ASC']],
        where,
      })

      return departments.map(
        (department: DepartmentInstance) =>
          new DepartmentEntity({
            id: department.id,
            title: department.title,
          }),
      )
    } catch {
      throw new InternalServerError(
        'DATABASE: Error while fetching departments by filters',
      )
    }
  }
}
