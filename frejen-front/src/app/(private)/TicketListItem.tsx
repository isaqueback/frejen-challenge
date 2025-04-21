// src/app/(private)/TicketListItem.tsx

import {
  CheckCircle,
  Clock,
  MoreVertical,
  RefreshCcw,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { ComponentType } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StateTitle, TicketState } from '@/hooks/useStates'

interface Department {
  id: number
  title: string
}

export interface Ticket {
  id: number
  title: string
  created_at: string
  updated_at: string
  department: Department
  state: TicketState
  description: string
  observations: string | null
}

export const statusMap: Record<
  StateTitle,
  {
    label: string
    color: string
    Icon: ComponentType<{ className?: string }>
  }
> = {
  PENDING: {
    label: 'Pending',
    color: 'bg-muted text-muted-foreground',
    Icon: Clock,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'bg-yellow-100 text-yellow-700',
    Icon: RefreshCcw,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-green-100 text-green-700',
    Icon: CheckCircle,
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-destructive/10 text-destructive',
    Icon: XCircle,
  },
}

export function TicketListItem({
  title,
  created_at,
  updated_at,
  department,
  state,
  id,
  description,
  observations,
}: Ticket) {
  const { label, color, Icon } = statusMap[state.title]

  return (
    <div className="max-xs:pb-8 flex items-center justify-between border-b pb-10 last:border-b-0 last:pb-0">
      <div className="flex flex-col gap-1">
        {/* Main title + status */}
        <div className="max-xs:flex-col max-xs:items-start max-xs:gap-1 max-xs:mb-4 flex items-center gap-2">
          <span className="text-foreground font-medium">{title}</span>
          <Badge
            className={`flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs ${color}`}
          >
            <Icon className="h-3 w-3" />
            {label}
          </Badge>
        </div>
        {/* Secondary info */}
        <p className="text-muted-foreground text-sm">
          Created: {new Date(created_at).toLocaleDateString()} · Last Updated:{' '}
          {new Date(updated_at).toLocaleDateString()}
        </p>
        <p className="text-muted-foreground text-sm">
          Department:{' '}
          <span className="text-foreground font-medium">
            {department.title}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="default" size="sm">
          <Link href={`/tickets/${id}`} className="max-sm:hidden">
            View Ticket
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="sm:hidden" asChild>
              <Link href={`/tickets/${id}`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={{
                  pathname: `/tickets/${id}/edit`,
                  query: {
                    ticketTitle: title,
                    ticketDescription: description,
                    ticketObservations: observations ?? '',
                    ticketDepartment: department.id,
                    ticketState: state.id,
                  },
                }}
              >
                Edit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
