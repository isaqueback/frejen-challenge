// src/app/(private)/tickets/[ticket]/edit/EditTicketContainer.tsx

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import { useContext } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { DepartmentCombobox } from '@/components/DepartmentCombobox'
import { BreadcrumbLink, PageNavigation } from '@/components/PageNavigation'
import { StateCombobox } from '@/components/StateCombobox'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TicketContext } from '@/contexts/TicketContext'
import { queryClient } from '@/services/query-client'

interface EditTicketContainerProps {
  ticketTitle?: string
  ticketState?: string
  ticketObservations?: string
  ticketDescription?: string
  ticketDepartment?: string
}

// 🧹 Helper function to convert empty strings to undefined
const emptyToUndefined = (val: unknown) =>
  typeof val === 'string' && val.trim() === '' ? undefined : val

// 📋 Form validation schema
const editTicketSchema = z.object({
  newDepartment: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ message: 'Department is required' }).int().positive().optional(),
  ),
  newTitle: z.preprocess(emptyToUndefined, z.string().optional()),
  newDescription: z.preprocess(emptyToUndefined, z.string().optional()),
  newObservations: z.preprocess(
    emptyToUndefined,
    z.string().optional().nullable(),
  ),
  newState: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ message: 'State is required' }).int().positive().optional(),
  ),
})

export type EditTicketSchema = z.infer<typeof editTicketSchema>

export function EditTicketContainer({
  ticketDepartment,
  ticketDescription,
  ticketObservations,
  ticketState,
  ticketTitle,
}: EditTicketContainerProps) {
  const { useEditTicket } = useContext(TicketContext)

  // 🧭 Navigation path setup
  const breadcrumbLinks: BreadcrumbLink[] = [
    {
      label: 'Tickets',
      href: '/',
    },
    {
      label: 'Edit',
      href: '',
    },
    {
      label: ticketTitle || 'Edit Ticket',
      href: '',
    },
  ]

  // 🔄 Parse default values with schema validation
  const parsedDefault = editTicketSchema.safeParse({
    newDepartment: ticketDepartment,
    newTitle: ticketTitle,
    newDescription: ticketDescription,
    newObservations: ticketObservations,
    newState: ticketState,
  })

  const defaultValues = parsedDefault.success
    ? parsedDefault.data
    : {
        newDepartment: undefined,
        newTitle: '',
        newDescription: '',
        newObservations: '',
        newState: undefined,
      }

  const form = useForm<EditTicketSchema>({
    resolver: zodResolver(editTicketSchema) as Resolver<EditTicketSchema>,
    defaultValues,
    mode: 'onChange',
  })

  const router = useRouter()
  const pathname = usePathname()

  // 🔑 Extract ticket ID from URL
  const ticketId = pathname.split('/').at(-2)

  // ✅ Form submission handler
  function onSubmit(data: EditTicketSchema) {
    // Trim all string values
    const trimmed = {
      newTitle: data.newTitle?.trim(),
      newDescription: data.newDescription?.trim(),
      newObservations: data.newObservations?.trim(),
    }

    // Validate required fields
    const missingFields = []
    if (!trimmed.newTitle) missingFields.push('Title')
    if (!trimmed.newDescription) missingFields.push('Description')

    // Show error if required fields are empty
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`, {
        className: '!bg-destructive !text-background',
        duration: 4000,
      })
      return
    }

    // Prevent emptying previously filled fields
    const wasErased =
      (defaultValues?.newTitle && trimmed.newTitle === '') ||
      (defaultValues?.newDescription && trimmed.newDescription === '')

    if (wasErased) {
      toast.error(
        'You cannot remove the content of fields that were previously filled.',
        {
          className: '!bg-destructive !text-background',
          duration: 4000,
        },
      )
      return
    }

    // 📝 Prepare final data for submission
    const newData: EditTicketSchema = {
      newTitle: trimmed.newTitle,
      newDescription: trimmed.newDescription,
      newObservations: trimmed.newObservations?.length
        ? trimmed.newObservations
        : null,
      newDepartment:
        data.newDepartment && data.newDepartment > 0
          ? data.newDepartment
          : undefined,
      newState: data.newState && data.newState > 0 ? data.newState : undefined,
    }

    // 🔢 Validate ticket ID
    const tickedIdParsed = z.coerce
      .number()
      .int()
      .positive()
      .safeParse(ticketId)

    if (!tickedIdParsed.success) {
      toast.error('This ticket does not exist', {
        className: '!bg-destructive !text-background',
        duration: 4000,
      })
      router.push('/')
      return
    }

    // 🚀 Submit ticket update
    useEditTicket.mutate(
      {
        ticketId: tickedIdParsed.data,
        newDepartmentId: newData.newDepartment,
        newTitle: newData.newTitle,
        newDescription: newData.newDescription,
        newObservations: newData.newObservations,
        newStateId: newData.newState,
      },
      {
        onError: (err) => {
          // Handle different error types
          switch (err.statusCode) {
            case 401:
              if (err.message.includes('token')) {
                toast.error('An unexpected error occurred', {
                  description: 'Please log in again',
                  descriptionClassName: '!text-background',
                  duration: 3000,
                  className: '!bg-red-500 !text-background',
                })

                router.push('/auth')
                break
              }
            case 403:
              toast.error(
                'Validation error occurred. Please check your input.',
                {
                  description: err.message,
                  descriptionClassName: '!text-background',
                  duration: 7000,
                  className: '!bg-red-500 !text-background',
                },
              )
              break
            case 404:
              toast.error('This ticket does not exist', {
                duration: 4000,
                className: '!bg-red-500 !text-background',
              })
              router.push('/')
              break
            case 422:
              toast.error(
                'Validation error occurred. Please check your input.',
                {
                  className: '!bg-destructive !text-background',
                  description: err.message,
                  descriptionClassName: '!text-background',
                  duration: 7000,
                },
              )
              break
            default:
              toast.error(
                'An unexpected error occurred. Please try again later.',
                {
                  className: '!bg-destructive !text-background',
                  duration: 4000,
                },
              )
              break
          }
        },
        onSuccess: () => {
          // Refresh ticket data and notify success
          queryClient.invalidateQueries({ queryKey: ['tickets'] })

          toast.success('Ticket updated successfully', {
            className: '!bg-emerald-500 !text-background',
            duration: 4000,
          })

          // Reset form with new values
          form.reset({
            newTitle: newData.newTitle,
            newDescription: newData.newDescription,
            newObservations: newData.newObservations ?? '',
            newDepartment: newData.newDepartment,
            newState: newData.newState,
          })
        },
      },
    )
  }

  return (
    <main className="flex w-full flex-col p-8">
      <PageNavigation title="Edit Ticket" breadcrumbLinks={breadcrumbLinks} />
      <div className="flex-1 rounded-lg bg-white py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="newTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="newDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department Selection */}
            <FormField
              control={form.control}
              name="newDepartment"
              render={({ field }) => (
                <FormItem className="w-[200px] max-sm:w-full">
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <DepartmentCombobox field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State Selection */}
            <FormField
              control={form.control}
              name="newState"
              render={({ field }) => (
                <FormItem className="w-[200px] max-sm:w-full">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <StateCombobox field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes Field */}
            <FormField
              control={form.control}
              name="newObservations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" disabled={!form.formState.isDirty}>
              Update Ticket
            </Button>
          </form>
        </Form>
      </div>
    </main>
  )
}
