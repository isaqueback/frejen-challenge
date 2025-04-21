'use client'

// src/app/(private)/TicketsContainer.tsx

import { BreadcrumbLink, PageNavigation } from '@/components/PageNavigation'

import { TicketList } from './TicketList'

// 🧭 Navigation path setup
const breadcrumbLinks: BreadcrumbLink[] = [
  {
    label: 'Tickets',
    href: '/',
  },
  {
    label: 'All Tickets',
    href: '',
  },
]

export function TicketsContainer() {
  return (
    <main className="flex w-full flex-col p-8">
      <PageNavigation title="Tickets" breadcrumbLinks={breadcrumbLinks} />
      <TicketList />
    </main>
  )
}
