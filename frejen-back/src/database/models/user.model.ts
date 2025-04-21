// src/database/models/user.model.ts

import { DataTypes, Model, Optional } from 'sequelize'

import { sequelize } from '@/database'

export interface UserAttributes {
  id: number
  name: string
  email: string
  password: string
  id_department: number
  admin: boolean
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'admin'>

export class UserInstance
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number
  public name!: string
  public email!: string
  public password!: string
  public id_department!: number
  public admin!: boolean
}

export const UserModel = sequelize.define<UserInstance>(
  'User',
  {
    admin: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    id_department: {
      allowNull: false,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'users',
    timestamps: false,
  },
)
