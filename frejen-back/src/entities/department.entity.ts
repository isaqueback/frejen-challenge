// src/entities/department.entity.ts

export class DepartmentEntity {
  public readonly id!: number
  public title!: string

  constructor(data: DepartmentEntity) {
    Object.assign(this, data)
  }
}
