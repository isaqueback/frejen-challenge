// src/entities/UserEntity.ts

import bcrypt from 'bcrypt'

export class UserEntity {
  public readonly id!: number
  public name!: string
  public readonly email!: string
  public password!: string
  public id_department!: number
  public readonly admin!: boolean

  constructor(data: Omit<UserEntity, 'isPasswordValid'>) {
    Object.assign(this, data)
  }

  async isPasswordValid(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
  }
}
