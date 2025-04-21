// src/hooks/useTicket.ts

'use client'

import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

const ticketIdSchema = z
  .object({
    ticketId: z.coerce.number().int().positive().optional(),
  })
  .strict()

type Ticket = {
  created_at: string
  created_by: {
    id: number
    name: string
    email: string
    department: { title: string; id: number }
  }
  description: string
  id: number
  observations: string | null
  state: {
    id: number
    title: string
  }
  ticketDepartment: {
    id: number
    title: string
  }
  title: string
  updated_at: string
  updated_by: {
    id: number
    name: string
    email: string
    department: { title: string; id: number }
  }
}

export function useTicket(id: string | undefined) {
  return useQuery<Ticket, ErrorResponse>({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const res = await fetch(`${backendBaseUrl}/tickets/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      const data = await res.json()
      if (!res.ok) throw data
      return data
    },
    enabled: ticketIdSchema.safeParse({ ticketId: id }).success,
    retry: (failureCount, error) => {
      if (error?.statusCode === 403) return false

      return failureCount < 3
    },
  })
}
