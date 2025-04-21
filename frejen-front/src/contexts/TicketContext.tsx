// src/contexts/TicketContext.tsx

'use client'

import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { createContext, useMemo, useState } from 'react'

import { useTicketStates } from '@/hooks/useStates'
import { useTickets } from '@/hooks/useTickets'

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

type CreateTicketProps = {
  title: string
  description: string
  id_department: number
}

type CreateTicketResponse = void

type EditTicketProps = {
  newDepartmentId?: number
  newDescription?: string
  newObservations?: string | null
  newStateId?: number
  newTitle?: string
  ticketId: number
}

type EditTicketResponse = void

type TicketContextType = {
  useCreateTicket: UseMutationResult<
    CreateTicketResponse,
    ErrorResponse,
    CreateTicketProps
  >
  useEditTicket: UseMutationResult<
    EditTicketResponse,
    ErrorResponse,
    EditTicketProps
  >
  store: ReturnType<typeof useTicketStore>
}

export const TicketContext = createContext({} as TicketContextType)

function useTicketStore() {
  const { data: ticketStates } = useTicketStates()
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const selectedStateIds = useMemo(() => {
    if (!ticketStates) return []
    return ticketStates
      .filter((s) => selectedStatus.includes(s.title))
      .map((s) => s.id)
  }, [selectedStatus, ticketStates])

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTickets({
    search,
    ticketStates: selectedStateIds,
  })

  const tickets = useMemo(() => {
    const flat = data?.pages.flatMap((p) => p.tickets) ?? []
    const seen = new Set()
    return flat.filter((t) => {
      if (seen.has(t.id)) return false
      seen.add(t.id)
      return true
    })
  }, [data])

  return {
    tickets,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    selectedStatus,
    setSelectedStatus,
    search,
    setSearch,
  }
}

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const store = useTicketStore()

  const createTicket = async ({
    title,
    description,
    id_department,
  }: CreateTicketProps): Promise<CreateTicketResponse> => {
    const url = `${backendBaseUrl}/tickets`

    const body = JSON.stringify({
      title,
      description,
      id_department,
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      credentials: 'include',
    })

    if (!response.ok) {
      const err = await response.json()
      throw err
    }
  }

  const useCreateTicket = useMutation<
    CreateTicketResponse,
    ErrorResponse,
    CreateTicketProps
  >({
    mutationFn: createTicket,
  })

  const editTicket = async ({
    newDepartmentId,
    newDescription,
    newObservations,
    newStateId,
    newTitle,
    ticketId,
  }: EditTicketProps): Promise<EditTicketResponse> => {
    const url = `${backendBaseUrl}/tickets/${ticketId}`

    const body = JSON.stringify({
      newDepartmentId,
      newDescription,
      newObservations,
      newStateId,
      newTitle,
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
      const err = await response.json()
      throw err
    }
  }

  const useEditTicket = useMutation<
    EditTicketResponse,
    ErrorResponse,
    EditTicketProps
  >({
    mutationFn: editTicket,
  })

  return (
    <TicketContext.Provider value={{ store, useCreateTicket, useEditTicket }}>
      {children}
    </TicketContext.Provider>
  )
}
