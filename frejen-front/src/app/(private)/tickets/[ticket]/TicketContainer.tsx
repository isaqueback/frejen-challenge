'use client'

import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import {
  Building2,
  Calendar,
  Mail,
  RefreshCcw,
  SquarePen,
  StickyNote,
  Tag,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'

import { BreadcrumbLink, PageNavigation } from '@/components/PageNavigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useTicket } from '@/hooks/useTicket'

import { TicketSkeletonContainer } from './TicketSkeletonContainer'

export function TicketContainer() {
  const router = useRouter()
  const pathname = usePathname()

  // 🔑 Extract ticket ID from URL path
  const ticketId = pathname.split('/').at(-1)
  const { data: ticket, isError, error } = useTicket(ticketId)

  // ⚠️ Handle authentication and permission errors
  useEffect(() => {
    if (isError && error) {
      if (error.statusCode === 401 && error.message.includes('token')) {
        toast.error('An unexpected error occurred', {
          description: 'Please log in again',
          descriptionClassName: '!text-background',
          duration: 3000,
          className: '!bg-red-500 !text-background',
        })
        router.push('/auth')
      } else if (error.statusCode === 403) {
        toast.error('Access denied', {
          description: 'You do not have permission to view this ticket',
          descriptionClassName: '!text-background',
          duration: 3000,
          className: '!bg-red-500 !text-background',
        })
        router.push('/')
      } else {
        toast.error('An unexpected error occurred', {
          duration: 3000,
          className: '!bg-red-500 !text-background',
        })
        router.push('/')
      }
    }
  }, [isError, error, router])

  // 📅 Format date helper function
  const formatDate = (dateStr: string) =>
    format(new Date(dateStr), "MMMM do yyyy 'at' HH:mm", {
      locale: enUS,
    })

  // 🧭 Navigation path setup
  const breadcrumbLinks: BreadcrumbLink[] = useMemo(
    () => [
      {
        label: 'Tickets',
        href: '/',
      },
      {
        label: ticket?.title ?? '',
        href: '',
      },
    ],
    [ticket?.title],
  )

  // Show skeleton while loading or render ticket data when available
  return ticket ? (
    <main className="max-xs:px-2 flex w-full flex-col p-8">
      <PageNavigation title={ticket.title} breadcrumbLinks={breadcrumbLinks} />

      <div className="max-xs:px-0 flex-1 p-6">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardAction>
              <Button variant="ghost" asChild>
                <Link
                  href={{
                    pathname: `/tickets/${ticket.id}/edit`,
                    query: {
                      ticketTitle: ticket.title,
                      ticketDescription: ticket.description,
                      ticketObservations: ticket.observations ?? '',
                      ticketDepartment: ticket.ticketDepartment.id,
                      ticketState: ticket.state.id,
                    },
                  }}
                  className="flex items-center text-amber-600 hover:text-amber-600"
                >
                  <SquarePen className="size-3.5" />
                  Edit
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-6 px-0 text-sm">
            {/* Ticket Status */}
            <div className="flex items-center gap-2">
              <Tag className="text-foeground size-4" />
              <span className="text-foreground text-base">Status:</span>
              <Badge
                variant="outline"
                className="text-primary border-primary bg-primary/10 capitalize"
              >
                {ticket.state.title.replace('_', ' ').toLowerCase()}
              </Badge>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-primary mb-1 flex items-center gap-2 text-base font-medium">
                <StickyNote className="size-4.5" />
                Description
              </h3>
              <p className="text-foreground">{ticket.description}</p>
            </div>

            {/* Observations/Notes (conditionally rendered) */}
            {ticket.observations && (
              <div>
                <h3 className="text-primary mb-1 flex items-center gap-2 text-base font-medium">
                  <StickyNote className="size-4.5" />
                  Notes
                </h3>
                <p className="text-foreground">{ticket.observations}</p>
              </div>
            )}

            <Separator />

            {/* User Information */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Created by */}
              <div>
                <h3 className="text-primary mb-1 flex items-center gap-2 text-base font-medium">
                  <User className="size-4.5" />
                  Created by
                </h3>
                <p className="text-foreground">{ticket.created_by.name}</p>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Mail className="size-4" />
                  {ticket.created_by.email}
                </p>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Building2 className="size-4" />
                  {ticket.created_by.department.title}
                </p>
                <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                  <Calendar className="size-4" />
                  Created at: {formatDate(ticket.created_at)}
                </p>
              </div>

              {/* Updated by */}
              <div>
                <h3 className="text-primary mb-1 flex items-center gap-2 text-base font-medium">
                  <RefreshCcw className="size-4.5" />
                  Last update
                </h3>
                <p className="text-foreground">{ticket.updated_by.name}</p>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Mail className="size-4" />
                  {ticket.updated_by.email}
                </p>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Building2 className="size-4" />
                  {ticket.updated_by.department.title}
                </p>
                <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                  <Calendar className="size-4" />
                  Updated at: {formatDate(ticket.updated_at)}
                </p>
              </div>
            </div>

            <Separator />

            {/* Responsible Department */}
            <div>
              <h3 className="text-primary mb-1 flex items-center gap-2 text-base font-medium">
                <Building2 className="size-4.5" />
                Responsible department
              </h3>
              <p className="text-foreground">{ticket.ticketDepartment.title}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  ) : (
    <TicketSkeletonContainer />
  )
}
