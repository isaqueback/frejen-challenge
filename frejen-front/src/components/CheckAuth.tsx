// src/components/CheckAuth.tsx

'use client'

import { useContext, useEffect } from 'react'

import { AuthContext } from '../contexts/AuthContext'

export function CheckAuth() {
  const { useMe } = useContext(AuthContext)

  useEffect(() => {
    useMe.mutate(undefined)
  }, [])

  return undefined
}
