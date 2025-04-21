// src/app/(private)/TicketList.tsx

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { debounce } from 'lodash'
import { X } from 'lucide-react'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { TicketContext } from '@/contexts/TicketContext'
import { useTicketStates } from '@/hooks/useStates'

import { FacetedFilter } from './FacetedFilterProps'
import { TicketListItem } from './TicketListItem'

const findTicketsSchema = z.object({
  search: z.string().optional(),
})
type FindTicketsSchema = z.infer<typeof findTicketsSchema>

export function TicketList() {
  const {
    store: {
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
    },
  } = useContext(TicketContext)

  const { data: ticketStates } = useTicketStates()

  // 🔄 Transform ticket states into filter options
  const stateOptions =
    ticketStates?.map((state) => ({
      label: state.title.replaceAll('_', ' ').toLowerCase(),
      value: state.title,
    })) ?? []

  // 📌 Store initial search value to avoid re-applying defaultValues on each render
  const initialSearchRef = useRef(search)
  const inputRef = useRef<HTMLInputElement>(null)
  const [statePopoverOpen, setStatePopoverOpen] = useState(false)

  const form = useForm<FindTicketsSchema>({
    resolver: zodResolver(findTicketsSchema),
    defaultValues: { search: initialSearchRef.current },
    mode: 'onChange',
  })

  // ⏱️ Optimize search with debounce to prevent excessive API calls
  const debouncedSetSearch = useCallback(
    debounce((val: string) => setSearch(val), 400),
    [setSearch],
  )

  // Sync form with context using debounce
  useEffect(() => {
    const subscription = form.watch((vals) => {
      debouncedSetSearch(vals.search ?? '')
    })
    return () => subscription.unsubscribe()
  }, [form, debouncedSetSearch])

  // Open filter popover when status is selected
  useEffect(() => {
    if (selectedStatus.length > 0) {
      setStatePopoverOpen(true)
    }
  }, [selectedStatus])

  // 🧹 Reset all filters
  const handleResetFilters = () => {
    form.reset({ search: '' }, { keepDefaultValues: false })
    setSearch('')
    setSelectedStatus([])
  }

  // 📜 Infinite scroll implementation using Intersection Observer
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: '100px' }, // Trigger before reaching the end
    )

    const currentRef = loadMoreRef.current
    if (currentRef) observer.observe(currentRef)

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div className="flex flex-col gap-8">
      {/* Search and Filters Section */}
      {isLoading || isError ? (
        <div className="max-xs:flex-col max-xs:items-start max-xs:justify-center flex items-center gap-2">
          <Skeleton className="max-xs:max-w-full h-9 w-full max-w-80 duration-1000" />
          <div className="flex items-center gap-2">
            <Skeleton className="flex h-9 w-20 items-center justify-around border border-dashed bg-transparent duration-1000">
              <Skeleton className="size-4 rounded-full bg-neutral-200" />
              <Skeleton className="h-4 w-8 bg-neutral-200" />
            </Skeleton>
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-8 bg-neutral-200" />
              <div>
                <Skeleton className="h-1 w-5 translate-x-[1px] translate-y-[3px] rotate-45 bg-neutral-200 duration-1000" />
                <Skeleton className="h-1 w-5 -rotate-45 bg-neutral-200 duration-1000" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form className="max-xs:flex-col max-xs:items-start flex items-center gap-2">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="max-xs:max-w-full w-full max-w-80">
                  <FormControl>
                    <Input
                      placeholder="Search tickets..."
                      {...field}
                      ref={inputRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="max-xs:flex-wrap flex items-center gap-2">
              <FacetedFilter
                title="State"
                selected={selectedStatus}
                onChange={setSelectedStatus}
                options={stateOptions}
                open={statePopoverOpen}
                onOpenChange={setStatePopoverOpen}
              />
              <Button variant="ghost" onClick={handleResetFilters}>
                Reset <X />
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Tickets List Section */}
      <div className="max-xs:gap-8 flex flex-col gap-10 px-40 max-xl:px-20 max-lg:px-0">
        {isLoading ? (
          // 🔄 Render loading skeletons
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex w-full items-center border-b pb-15 last:border-0"
            >
              <div className="flex w-full flex-col gap-2">
                <div className="max-xs:flex-col max-xs:items-start flex items-center gap-2">
                  <Skeleton className="h-4 w-36 bg-neutral-300 duration-1000" />
                  <Skeleton className="h-5 w-32 bg-neutral-200 duration-1000" />
                </div>
                <div className="max-xs:flex-col flex gap-2">
                  <Skeleton className="h-2 w-40 duration-1000" />
                  <Skeleton className="h-2 w-40 duration-1000" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-2 w-20 duration-1000" />
                  <Skeleton className="h-2 w-25 bg-neutral-300 duration-1000" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="max-xs:hidden h-8 w-24 bg-neutral-400 duration-1000" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="size-1 rounded-full bg-neutral-300 duration-1000" />
                  <Skeleton className="size-1 rounded-full bg-neutral-300 duration-1000" />
                  <Skeleton className="size-1 rounded-full bg-neutral-300 duration-1000" />
                </div>
              </div>
            </div>
          ))
        ) : isError ? (
          <p className="text-red-500">Error loading tickets.</p>
        ) : tickets.length === 0 ? (
          <p className="text-muted-foreground">No tickets found.</p>
        ) : (
          // 🎫 Render actual ticket items
          tickets.map((ticket) => (
            <TicketListItem key={ticket.id} {...ticket} />
          ))
        )}

        {/* Infinite Scroll Loader */}
        {hasNextPage && <div ref={loadMoreRef}>{isFetchingNextPage}</div>}
      </div>
    </div>
  )
}
