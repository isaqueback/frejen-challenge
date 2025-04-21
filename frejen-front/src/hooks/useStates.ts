// src/hooks/useTicketStates.ts
import { useQuery } from '@tanstack/react-query'

export type StateTitle = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'

export type TicketState = {
  id: number
  title: StateTitle
}

export const useTicketStates = () => {
  return useQuery<TicketState[], ErrorResponse>({
    queryKey: ['ticketStates'],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/states`
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      const data = await res.json()

      if (!res.ok) throw data
      return data
    },
    staleTime: Infinity,
  })
}
