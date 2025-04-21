'use  client'

import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { createContext, ReactNode } from 'react'

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

interface UserProviderProps {
  children: ReactNode
}

type UpdateUserResponse = void
type UpdateUserProps = {
  id_department?: number
  name?: string
  newPassword?: string
  password?: string
  user_id: number
}

type UserContextType = {
  useUpdateUser: UseMutationResult<
    UpdateUserResponse,
    ErrorResponse,
    UpdateUserProps
  >
}

export const UserContext = createContext({} as UserContextType)

export function UserProvider({ children }: UserProviderProps) {
  const updateUser = async ({
    id_department,
    name,
    newPassword,
    password,
    user_id,
  }: UpdateUserProps): Promise<UpdateUserResponse> => {
    const url = `${backendBaseUrl}/users/${user_id}`

    const body = JSON.stringify({
      id_department,
      name,
      newPassword,
      password,
    })
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      credentials: 'include',
    })

    if (!response.ok) {
      const data = await response.json()
      throw data
    }
  }

  const useUpdateUser = useMutation<
    UpdateUserResponse,
    ErrorResponse,
    UpdateUserProps
  >({
    mutationFn: updateUser,
  })

  return (
    <UserContext.Provider
      value={{
        useUpdateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
