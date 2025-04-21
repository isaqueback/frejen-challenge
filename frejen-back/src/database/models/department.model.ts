// src/database/models/department.model.ts

import { DataTypes, Model, Optional } from 'sequelize'

import { sequelize } from '@/database'

export interface DepartmentAttributes {
  id: number
  title: string
}

type DepartmentCreationAttributes = Optional<DepartmentAttributes, 'id'>

export class DepartmentInstance
  extends Model<DepartmentAttributes, DepartmentCreationAttributes>
  implements DepartmentAttributes
{
  public id!: number
  public title!: string
}

export const DepartmentModel = sequelize.define<DepartmentInstance>(
  'Department',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'departments',
    timestamps: false,
  },
)
