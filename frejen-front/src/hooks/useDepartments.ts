// src/hooks/useDepartments.ts

import { useInfiniteQuery } from '@tanstack/react-query'

export type Department = {
  id: number
  title: string
}

type DepartmentsPage = {
  departments: Department[]
  hasMore: boolean
}

export const useDepartments = (search: string = '') => {
  return useInfiniteQuery<DepartmentsPage, ErrorResponse>({
    queryKey: ['departments', search],
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams()
      if (pageParam) params.append('lastId', pageParam.toString())
      if (search) params.append('search', search)

      const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/departments?${params.toString()}`
      const res = await fetch(url)

      const data = await res.json()

      if (!res.ok) {
        throw data
      }

      return data
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined
      const lastItem = lastPage.departments.at(-1)
      return lastItem?.id ?? null
    },
    initialPageParam: null,
  })
}
