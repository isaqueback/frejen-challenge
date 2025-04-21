// src/app/(private)/tickets/[ticket]/TicketSkeletonContainer.tsx

import { BreadcrumbLink, PageNavigation } from '@/components/PageNavigation'
import { Skeleton } from '@/components/ui/skeleton'

// 🧭 Navigation path setup
const breadcrumbLinks: BreadcrumbLink[] = [
  {
    label: 'Tickets',
    href: '/',
  },
  {
    label: '',
    href: '',
  },
]

export function TicketSkeletonContainer() {
  return (
    <main className="max-xs:px-2 flex w-full flex-col p-8">
      <PageNavigation title="" breadcrumbLinks={breadcrumbLinks} />
      <div className="mt-13 flex items-center gap-1 self-end max-md:px-12">
        <Skeleton className="ml-auto size-4.5 bg-neutral-300 duration-1000" />
        <Skeleton className="ml-auto h-5 w-10 bg-neutral-300 duration-1000" />
      </div>
      <div className="my-auto mt-10 h-full w-full max-md:px-2">
        <div className="flex items-center gap-1 border-b pb-6">
          <Skeleton className="h-5 w-5 bg-neutral-200 duration-1000" />
          <Skeleton className="h-5 w-12 bg-neutral-200 duration-1000" />
          <Skeleton className="h-7 w-18 bg-neutral-300 duration-1000" />
        </div>
        <div className="flex flex-col gap-2 border-b py-6">
          <div className="flex items-center gap-1">
            <Skeleton className="size-5 bg-neutral-300 duration-1000" />
            <Skeleton className="h-5 w-20 bg-neutral-300 duration-1000" />
          </div>
          <Skeleton className="h-5 w-72 bg-neutral-200 duration-1000 max-md:w-40" />
        </div>
        <div className="flex flex-col gap-2 border-b py-6">
          <div className="flex items-center gap-1">
            <Skeleton className="size-5 bg-neutral-300 duration-1000" />
            <Skeleton className="h-5 w-20 bg-neutral-300 duration-1000" />
          </div>
          <Skeleton className="h-5 w-72 bg-neutral-200 duration-1000 max-md:w-40" />
        </div>
        <div className="flex gap-4 border-b py-6 max-md:flex-col">
          <div className="flex flex-col gap-2 md:flex-1">
            <div className="flex items-center gap-1">
              <Skeleton className="size-5 bg-neutral-300 duration-1000" />
              <Skeleton className="h-5 w-20 bg-neutral-300 duration-1000" />
            </div>
            <Skeleton className="h-5 w-18 bg-neutral-200 duration-1000" />
            <div className="flex items-center gap-1">
              <Skeleton className="size-4 bg-neutral-300 duration-1000" />
              <Skeleton className="h-4 w-36 bg-neutral-300 duration-1000" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="size-4 bg-neutral-300 duration-1000" />
              <Skeleton className="h-4 w-10 bg-neutral-300 duration-1000" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="size-4 bg-neutral-300 duration-1000" />
              <Skeleton className="h-4 w-48 bg-neutral-300 duration-1000" />
            </div>
          </div>
          <div className="flex flex-col gap-2 md:flex-1">
            <div className="flex items-center gap-1">
              <Skeleton className="size-5 bg-neutral-300 duration-1000" />
              <Skeleton className="h-5 w-20 bg-neutral-300 duration-1000" />
            </div>
            <Skeleton className="h-5 w-18 bg-neutral-200 duration-1000" />
            <div className="flex items-center gap-1">
              <Skeleton className="size-4 bg-neutral-300 duration-1000" />
              <Skeleton className="h-4 w-36 bg-neutral-300 duration-1000" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="size-4 bg-neutral-300 duration-1000" />
              <Skeleton className="h-4 w-10 bg-neutral-300 duration-1000" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="size-4 bg-neutral-300 duration-1000" />
              <Skeleton className="h-4 w-48 bg-neutral-300 duration-1000" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-6">
          <div className="flex items-center gap-1">
            <Skeleton className="size-5 bg-neutral-300 duration-1000" />
            <Skeleton className="h-5 w-52 bg-neutral-300 duration-1000" />
          </div>
          <Skeleton className="h-5 w-28 bg-neutral-200 duration-1000" />
        </div>
      </div>
    </main>
  )
}
