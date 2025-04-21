// src/services/user.service.ts

import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

import { UpdateUserRequestDtoType } from '@/dtos/user/request/update-user-request.dto'
import { UserEntity } from '@/entities/user.entity'
import { env } from '@/env'
import { BadRequestError, UnauthorizedError } from '@/errors'
import { DepartmentRepository } from '@/repositories/department/department.repository'
import { UserRepository } from '@/repositories/user/user.repository'

import { AuthService } from './auth.service'

type UserServiceUpdateProps = UpdateUserRequestDtoType & {
  user: UserEntity
}
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly authService: AuthService,
  ) {}

  async update({
    id_department,
    name,
    newPassword,
    paramUserId,
    password: passwordHash,
    user,
  }: UserServiceUpdateProps): Promise<{
    updatedUser: UserEntity
    newAccessToken: string
  }> {
    this.authorizeUser(paramUserId, user)

    if (id_department) {
      const isDepartmentValid =
        await this.departmentRepository.findById(id_department)

      if (!isDepartmentValid)
        throw new UnauthorizedError('Department not found')
    }

    if (newPassword) {
      const isCurrentPasswordValid = await user.isPasswordValid(
        passwordHash || '',
      )

      if (!isCurrentPasswordValid)
        throw new UnauthorizedError('Invalid password')

      const equalPasswords =
        (await user.isPasswordValid(newPassword)) && isCurrentPasswordValid

      if (equalPasswords)
        throw new UnauthorizedError(
          'New password cannot be the same as the current password',
        )
    }

    const newPasswordHash = newPassword
      ? await bcrypt.hash(newPassword, 10)
      : undefined

    const dataToUpdate: Partial<
      Omit<UserEntity, 'isPasswordValid' | 'id' | 'admin' | 'email'>
    > = {
      id_department,
      name,
      password: newPasswordHash,
    }

    const updatedUser = await this.userRepository.update({
      data: dataToUpdate,
      where: { id: user.id },
    })

    if (!updatedUser) throw new BadRequestError('No data has been updated')

    const newAccessToken = this.authService.generateAccessToken(updatedUser)

    return { newAccessToken, updatedUser }
  }

  private authorizeUser(paramUserId: number, user: UserEntity): void {
    if (paramUserId !== user.id)
      throw new UnauthorizedError('User ID does not match token')
  }
}
