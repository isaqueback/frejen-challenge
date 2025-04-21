// src/app/(private)/tickets/new/page.tsx

import { BreadcrumbLink, PageNavigation } from '@/components/PageNavigation'

import { NewTicketContainer } from './NewTicketContainer'

// 🧭 Navigation path setup
const breadcrumbLinks: BreadcrumbLink[] = [
  {
    label: 'Tickets',
    href: '/',
  },
  {
    label: 'New Ticket',
    href: '',
  },
]

export default async function NewTicketPage() {
  return (
    <main className="flex w-full flex-col p-8">
      <PageNavigation title="New Ticket" breadcrumbLinks={breadcrumbLinks} />
      <NewTicketContainer />
    </main>
  )
}
