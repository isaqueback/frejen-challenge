// src/types/make-some-required.ts

export type MakeSomeRequired<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>
