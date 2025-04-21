// src// src/hooks/useTickets.ts

'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { queryClient } from '@/services/query-client'

import { TicketState } from './useStates'

type Department = {
  id: number
  title: string
}

export type Ticket = {
  id: number
  title: string
  created_at: string
  updated_at: string
  department: Department
  state: TicketState
  observations: string | null
  description: string
}

type TicketsPage = {
  tickets: Ticket[]
  hasMore: boolean
}

type Params = {
  search?: string
  ticketStates?: number[]
}

export const useTickets = ({ search = '', ticketStates = [] }: Params) => {
  const router = useRouter()

  return useInfiniteQuery<TicketsPage, ErrorResponse>({
    queryKey: ['tickets', search, ticketStates],
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams()

      if (pageParam) params.append('lastId', pageParam.toString())
      if (search) params.append('search', search)
      if (ticketStates.length > 0)
        params.append('ticketStates', ticketStates.join(','))

      const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/tickets?${params.toString()}`
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      const data = await res.json()

      if (!res.ok) {
        const err = await res.json()
        if (err?.message?.includes('token')) {
          queryClient.clear()
          router.push('/')
        }

        throw err
      }

      return data
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined
      const lastTicket = lastPage.tickets.at(-1)
      return lastTicket?.id ?? null
    },
    initialPageParam: null,
  })
}
