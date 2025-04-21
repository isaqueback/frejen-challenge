// src/services/auth.service.ts

import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import { SignInRequestDtoType } from '@/dtos/auth/request/sign-in-request.dto'
import { SignUpRequestDtoType } from '@/dtos/auth/request/sign-up-request.dto'
import { UserEntity } from '@/entities/user.entity'
import { env } from '@/env'
import { ConflictError, NotFoundError, UnauthorizedError } from '@/errors'
import { DepartmentRepository } from '@/repositories/department/department.repository'
import { UserRepository } from '@/repositories/user/user.repository'
import { AccessTokenPayload } from '@/types/access-token-payload'

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly departmentRepository: DepartmentRepository,
  ) {}

  generateAccessToken(user: UserEntity): string {
    const payload = {
      admin: user.admin,
      departmentId: user.id_department,
      email: user.email,
      name: user.name,
      userId: user.id,
    } as AccessTokenPayload

    const expiresAt = env.ACCESS_TOKEN_EXPIRATION / 1000
    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: expiresAt,
    })

    return accessToken
  }

  async signIn(props: SignInRequestDtoType): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(props.email)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    const isPasswordValid = await user.isPasswordValid(props.password)

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid password')
    }

    const accessToken = this.generateAccessToken(user)

    return { accessToken }
  }

  async signUp(props: SignUpRequestDtoType): Promise<void> {
    const userExists = await this.userRepository.findByEmail(props.email)

    if (userExists) {
      throw new ConflictError('User already exists')
    }

    const departmentExists = await this.departmentRepository.findById(
      props.id_department,
    )

    if (!departmentExists) {
      throw new NotFoundError('Department not found')
    }

    const adminExists =
      (await this.userRepository.findByFilters({ admin: true })).length > 0

    const passwordHash = await bcrypt.hash(props.password, 10)

    const newUser = {
      admin: !adminExists,
      email: props.email,
      id_department: props.id_department,
      name: props.name,
      password: passwordHash,
    }

    await this.userRepository.save(newUser)
  }
}
