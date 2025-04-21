// src/repositories/user/user.repository.ts

import { FindOptions, Op, WhereOptions } from 'sequelize'

import { db } from '@/database/models'
import { UserAttributes, UserInstance } from '@/database/models/user.model'
import { UserEntity } from '@/entities/user.entity'
import { InternalServerError } from '@/errors'

import {
  IUserRepository,
  UserRepositoryFindByFiltersProps,
  UserRepositorySaveProps,
  UserRepositoryUpdateProps,
} from './user-repository.interface'

export class UserRepository implements IUserRepository {
  async save(data: UserRepositorySaveProps): Promise<void> {
    try {
      await db.user.create({
        ...data,
      })
    } catch {
      throw new InternalServerError('DATABASE: Error saving user')
    }
  }

  async findById(id: number): Promise<UserEntity | null> {
    try {
      const user = await db.user.findByPk(id)

      if (!user) return null

      return new UserEntity({
        admin: user.admin,
        email: user.email,
        id: user.id,
        id_department: user.id_department,
        name: user.name,
        password: user.password,
      })
    } catch {
      throw new InternalServerError('DATABASE: Error finding user by ID')
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      const user = await db.user.findOne({ where: { email } })
      if (!user) return null

      return new UserEntity({
        admin: user.admin,
        email: user.email,
        id: user.id,
        id_department: user.id_department,
        name: user.name,
        password: user.password,
      })
    } catch {
      throw new InternalServerError('DATABASE: Error finding user by email')
    }
  }

  async findByFilters(
    props: UserRepositoryFindByFiltersProps,
  ): Promise<UserEntity[]> {
    try {
      const where: WhereOptions<UserAttributes> = {}
      const order: [keyof UserAttributes, 'ASC' | 'DESC'][] = [['id', 'ASC']]

      const queryOptions: FindOptions<UserAttributes> = {
        limit: props.limit || 10,
        offset: props.offset || 0,
        order,
        where,
      }

      if (props.admin !== undefined) {
        Object.assign(where, { admin: props.admin })
      }

      if (props.id_department !== undefined) {
        where.id_department = props.id_department
      }

      if (props.name) {
        where.name = { [Op.like]: `%${props.name}%` }
      }

      if (props.email) {
        Object.assign(where, { email: { [Op.like]: `%${props.email}%` } })
      }

      if (props.sortBy) {
        order[0][0] = props.sortBy
      }

      if (props.order) {
        order[0][1] = props.order
      }

      const users = await db.user.findAll(queryOptions)

      return users.map(
        (user) =>
          new UserEntity({
            admin: user.admin,
            email: user.email,
            id: user.id,
            id_department: user.id_department,
            name: user.name,
            password: user.password,
          }),
      )
    } catch (error) {
      throw new InternalServerError('DATABASE: Error finding user by filters')
    }
  }

  async update(props: UserRepositoryUpdateProps): Promise<UserEntity | null> {
    try {
      const { data, where } = props
      let affectedCount = 0

      if ('id' in where) {
        ;[affectedCount] = await db.user.update(data, {
          where: { id: where.id },
        })
      } else if ('email' in where) {
        ;[affectedCount] = await db.user.update(data, {
          where: { email: where.email },
        })
      } else {
        throw new Error('Invalid update criteria')
      }

      if (affectedCount === 0) {
        return null
      }

      const updatedUser = await db.user.findOne({ where })

      if (!updatedUser) {
        return null
      }

      return new UserEntity({
        admin: updatedUser.admin,
        email: updatedUser.email,
        id: updatedUser.id,
        id_department: updatedUser.id_department,
        name: updatedUser.name,
        password: updatedUser.password,
      })
    } catch {
      throw new InternalServerError('DATABASE: Error updating user')
    }
  }
}
