'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { DepartmentCombobox } from '@/components/DepartmentCombobox'
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

// 📋 Form validation schema
const createTicketSchema = z.object({
  title: z.string().nonempty('Title is required'),
  id_department: z.coerce
    .number({ message: 'Select a department' })
    .int()
    .positive({ message: 'Select a department' }),
  description: z.string().nonempty('Description is required'),
})

export type CreateTicketSchema = z.infer<typeof createTicketSchema>

export function NewTicketContainer() {
  const router = useRouter()
  const form = useForm<CreateTicketSchema>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: '',
      id_department: undefined,
      description: '',
    },
    mode: 'onChange',
  })

  const { useCreateTicket } = useContext(TicketContext)

  // 🎫 Handle ticket creation submission
  function onSubmit({ description, id_department, title }: CreateTicketSchema) {
    useCreateTicket.mutate(
      { description, id_department, title },
      {
        onSuccess: () => {
          toast.success('Ticket created successfully', {
            duration: 3000,
            className: '!bg-emerald-500 !text-background',
          })

          // Refresh ticket list data
          queryClient.invalidateQueries({ queryKey: ['tickets'] })
          form.reset()
        },
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
            case 422:
              toast.error('Invalid data', {
                duration: 3000,
                className: '!bg-red-500 !text-background',
                description: err.message,
              })
              break
            default:
              toast.error('An unexpected error occurred', {
                duration: 3000,
                className: '!bg-red-500 !text-background',
              })
              break
          }
        },
      },
    )
  }

  return (
    <div className="flex-1 rounded-lg py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter ticket title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter ticket description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Department selection */}
          <FormField
            control={form.control}
            name="id_department"
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

          <Button
            type="submit"
            disabled={useCreateTicket.isPending || form.formState.isSubmitting}
          >
            {useCreateTicket.isPending || form.formState.isSubmitting
              ? 'Creating...'
              : 'Create Ticket'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
