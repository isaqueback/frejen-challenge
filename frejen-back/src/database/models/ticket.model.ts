// src/database/models/ticket.model.ts

import { DataTypes, Model, Optional } from 'sequelize'

import { sequelize } from '@/database'

import { DepartmentAttributes } from './department.model'
import { StateAttributes } from './state.model'

export interface TicketAttributes {
  id: number
  title: string
  description: string
  created_at: Date
  updated_at: Date
  created_by: number
  updated_by: number
  id_state: number
  id_department: number
  observations: string | null
  department?: DepartmentAttributes
  state?: StateAttributes
}

type TicketCreationAttributes = Optional<TicketAttributes, 'id'>

class TicketInstance
  extends Model<TicketAttributes, TicketCreationAttributes>
  implements TicketAttributes
{
  public id!: number
  public title!: string
  public description!: string
  public created_at!: Date
  public updated_at!: Date
  public created_by!: number
  public updated_by!: number
  public id_state!: number
  public id_department!: number
  public observations!: string | null
  public department?: DepartmentAttributes
  public state?: StateAttributes
}

export const TicketModel = sequelize.define<TicketInstance>(
  'Ticket',
  {
    created_at: {
      allowNull: false,
      defaultValue: DataTypes.NOW,
      type: DataTypes.DATE,
    },
    created_by: {
      allowNull: false,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
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
    id_state: {
      allowNull: false,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    observations: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    updated_at: {
      allowNull: false,
      defaultValue: DataTypes.NOW,
      type: DataTypes.DATE,
    },
    updated_by: {
      allowNull: false,
      type: DataTypes.INTEGER.UNSIGNED,
    },
  },
  {
    tableName: 'tickets',
    timestamps: false, // Already using custom created_at and updated_at
  },
)
