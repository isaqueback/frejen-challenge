// src/database/models/state.model.ts

import { DataTypes, Model, Optional } from 'sequelize'

import { sequelize } from '@/database'

export interface StateAttributes {
  id: number
  title: 'PENDING' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED'
}

type StateCreationAttributes = Optional<StateAttributes, 'id'>

class StateInstance
  extends Model<StateAttributes, StateCreationAttributes>
  implements StateAttributes
{
  public id!: number
  public title!: 'PENDING' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED'
}

export const StateModel = sequelize.define<StateInstance>(
  'State',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    title: {
      allowNull: false,
      type: DataTypes.ENUM('PENDING', 'REJECTED', 'IN_PROGRESS', 'COMPLETED'),
    },
  },
  {
    tableName: 'states',
    timestamps: false,
  },
)
