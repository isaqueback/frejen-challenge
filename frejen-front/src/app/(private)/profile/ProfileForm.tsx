// src/app/(private)/profile/ProfileForm.tsx

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { DepartmentCombobox } from '@/components/DepartmentCombobox'
import { BreadcrumbLink, PageNavigation } from '@/components/PageNavigation'
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
import { AuthContext } from '@/contexts/AuthContext'
import { UserContext } from '@/contexts/UserContext'

// 🧭 Navigation path setup
const breadcrumbLinks: BreadcrumbLink[] = [
  {
    label: 'Profile',
    href: '/profile',
  },
  {
    label: 'My Profile',
    href: '',
  },
]

const baseSchema = z.object({
  id_department: z.coerce
    .number({ message: 'Select a department' })
    .int()
    .positive({ message: 'Select a department' })
    .optional(),
  name: z
    .string()
    .nonempty('Name must be at least 1 character long')
    .optional(),
})
const profileSchema = baseSchema
  .extend({
    password: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      const isChangingPassword = data.password || data.newPassword
      if (!isChangingPassword) return true

      return (data.password?.length ?? 0) >= 8
    },
    {
      message: 'Passwords must be at least 8 characters long',
      path: ['password'],
    },
  )
  .refine(
    (data) => {
      const isChangingPassword = data.password || data.newPassword
      if (!isChangingPassword) return true

      return (data.newPassword?.length ?? 0) >= 8
    },
    {
      message: 'Passwords must be at least 8 characters long',
      path: ['newPassword'],
    },
  )

export type ProfileSchema = z.infer<typeof profileSchema>

export function ProfileForm() {
  const router = useRouter()
  const { user, setUser } = useContext(AuthContext)
  const { useUpdateUser } = useContext(UserContext)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      id_department: undefined,
      newPassword: '',
      password: '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? '',
        id_department: user.departmentId ?? undefined,
        newPassword: '',
        password: '',
      })
    }
  }, [user, form])

  function onSubmit(data: ProfileSchema) {
    const newData = {
      id_department: data.id_department,
      name: data.name,
      newPassword:
        'newPassword' in data
          ? data.newPassword
            ? data.newPassword
            : undefined
          : undefined,
      password:
        'password' in data
          ? data.password
            ? data.password
            : undefined
          : undefined,
      user_id: user?.userId as number,
    }

    useUpdateUser.mutate(newData, {
      onSuccess: () => {
        toast.success('Profile Updated!', {
          className: '!bg-emerald-500 !text-background',
          duration: 3000,
        })

        setUser((prev) => {
          if (!prev) return prev

          return {
            ...prev,
            name: newData.name ?? prev.name,
            departmentId: newData.id_department ?? prev.departmentId,
          }
        })
      },
      onError: (err) => {
        switch (err.statusCode) {
          case 400:
            toast.error('No data has been updated!', {
              description: 'Provide new data, not old data.',
              className: '!bg-destructive !text-background',
              descriptionClassName: '!text-background',
              duration: 4000,
            })
            break
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
            toast.error(err.message, {
              className: '!bg-destructive !text-background',
              duration: 4000,
            })
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
    })
  }

  return (
    <main className="flex w-full flex-col p-8">
      <PageNavigation title="Profile" breadcrumbLinks={breadcrumbLinks} />
      <div className="flex-1 rounded-lg bg-white py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={user?.name} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="********"
                          {...field}
                        />
                        <button
                          type="button"
                          className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                          onClick={() => setShowPassword((prev) => !prev)}
                          tabIndex={-1}
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                          title={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage>‎</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="********"
                          {...field}
                        />
                        <button
                          type="button"
                          className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          tabIndex={-1}
                          aria-label={
                            showNewPassword
                              ? 'Hide new password'
                              : 'Show new password'
                          }
                          title={
                            showNewPassword
                              ? 'Hide new password'
                              : 'Show new password'
                          }
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage>‎</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={useUpdateUser.isPending || form.formState.isSubmitting}
            >
              {useUpdateUser.isPending || form.formState.isSubmitting
                ? 'Updating...'
                : 'Update Profile'}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  )
}
