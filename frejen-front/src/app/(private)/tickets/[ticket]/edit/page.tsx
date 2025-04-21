// src/app/(private)/tickets/[ticket]/edit/page.tsx

import { EditTicketContainer } from './EditTicketContainer'

interface EditTicketPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditTicketPage({
  searchParams,
}: EditTicketPageProps) {
  const resolvedSearchParams = await searchParams

  const {
    ticketTitle,
    ticketState,
    ticketObservations,
    ticketDescription,
    ticketDepartment,
  } = resolvedSearchParams

  return (
    <EditTicketContainer
      ticketDepartment={Array.isArray(ticketDepartment) ? '' : ticketDepartment}
      ticketDescription={
        Array.isArray(ticketDescription) ? '' : ticketDescription
      }
      ticketObservations={
        Array.isArray(ticketObservations) ? '' : ticketObservations
      }
      ticketState={Array.isArray(ticketState) ? '' : ticketState}
      ticketTitle={Array.isArray(ticketTitle) ? '' : ticketTitle}
    />
  )
}
