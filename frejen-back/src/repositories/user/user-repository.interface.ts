// src/repositories/user/user-repository.interface.ts

import { UserEntity } from '@/entities/user.entity'

export type UserRepositorySaveProps = {
  name: string
  email: string
  password: string
  id_department: number
  admin: boolean
}

export type UserRepositoryFindByFiltersProps = Partial<
  Omit<UserEntity, 'isPasswordValid'>
> & {
  order?: 'ASC' | 'DESC'
  limit?: number
  offset?: number
  sortBy?: keyof Omit<UserEntity, 'isPasswordValid'>
}

export type UserRepositoryUpdateProps = {
  data: Partial<Omit<UserEntity, 'isPasswordValid' | 'id' | 'email' | 'admin'>>
  where:
    | {
        id: number
      }
    | {
        email: string
      }
}

export abstract class IUserRepository {
  abstract save(props: UserRepositorySaveProps): Promise<void>
  abstract findById(id: number): Promise<UserEntity | null>
  abstract findByEmail(
    email: string,
  ): Promise<Omit<UserEntity, 'isPasswordValid'> | null>
  abstract findByFilters(
    props: UserRepositoryFindByFiltersProps,
  ): Promise<UserEntity[]>
  abstract update(props: UserRepositoryUpdateProps): Promise<UserEntity | null>
}
