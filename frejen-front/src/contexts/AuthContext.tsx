// src/contexts/AuthContext.tsx

'use client'

import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react'

import { queryClient } from '@/services/query-client'

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

type User = {
  admin: boolean
  email: string
  name: string
  userId: number
  departmentId: number
}

type SignInProps = {
  email: string
  password: string
}
type SignInResponse = void

type SignUpProps = {
  name: string
  email: string
  password: string
  id_department: number
}
type SignUpResponse = void

type SignOutProps = void
type SignOutResponse = Promise<void>

type MeProps = void
type MeResponse = User

type AuthContextType = {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  isAuthenticated: boolean
  useSignIn: UseMutationResult<SignInResponse, ErrorResponse, SignInProps>
  useSignUp: UseMutationResult<SignUpResponse, ErrorResponse, SignUpProps>
  useSignOut: UseMutationResult<SignOutResponse, ErrorResponse, SignOutProps>
  useMe: UseMutationResult<MeResponse, ErrorResponse, MeProps>
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const isAuthenticated = !!user

  const signIn = async ({
    email,
    password,
  }: SignInProps): Promise<SignInResponse> => {
    const url = `${backendBaseUrl}/auth/sign-in`
    console.log(url)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    })

    if (!response.ok) {
      const data = await response.json()
      throw data as ErrorResponse
    }
  }

  const useSignIn = useMutation<SignInResponse, ErrorResponse, SignInProps>({
    mutationFn: signIn,
  })

  const signOut = async (): Promise<SignOutResponse> => {
    const url = `${backendBaseUrl}/auth/sign-out`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const data = await response.json()

      throw data
    }
  }

  const useSignOut = useMutation<SignOutResponse, ErrorResponse, SignOutProps>({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear()
      setUser(null)
    },
  })

  const signUp = async (data: SignUpProps): Promise<SignUpResponse> => {
    const url = `${backendBaseUrl}/auth/sign-up`
    const body = JSON.stringify(data)

    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const data = await response.json()

      throw data as ErrorResponse
    }
  }

  const useSignUp = useMutation<SignUpResponse, ErrorResponse, SignUpProps>({
    mutationFn: signUp,
  })

  const me = async () => {
    const url = `${backendBaseUrl}/auth/me`
    const response = await fetch(url, {
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) throw data

    return data
  }

  const useMe = useMutation<MeResponse, ErrorResponse, MeProps>({
    mutationFn: me,
    onSuccess: (data) => {
      setUser(data)
    },
    onError: () => {
      queryClient.clear()
      router.push('/auth')
    },
  })

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        useSignIn,
        useSignUp,
        useSignOut,
        useMe,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
