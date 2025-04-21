'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { TabsContent } from '@/components/ui/tabs'
import { AuthContext } from '@/contexts/AuthContext'

import { DepartmentCombobox } from '../../../components/DepartmentCombobox'

interface SignUpContainerProps {
  tab: string
}

const signUpSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Enter a valid email' }),
    password: z.string().min(8, { message: 'Minimum 8 characters' }),
    confirmPassword: z.string().min(8, { message: 'Minimum 8 characters' }),
    id_department: z.coerce
      .number({ message: 'Select a department' })
      .int()
      .positive({ message: 'Select a department' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type SignUpSchema = z.infer<typeof signUpSchema>

export function SignUpContainer({ tab }: SignUpContainerProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { useSignUp, useSignOut, useSignIn } = useContext(AuthContext)

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      id_department: undefined,
    },
    mode: 'onChange',
  })

  function onSubmit(data: SignUpSchema) {
    const body = {
      name: data.name,
      email: data.email,
      password: data.password,
      id_department: data.id_department,
    }
    useSignUp.mutate(body, {
      onError: (error) => {
        switch (error.statusCode) {
          case 409:
            toast.error('User already exists', {
              className: '!bg-destructive !text-background',
            })
            break
          case 422:
            toast.error('Validation error occurred. Please check your input.', {
              className: '!bg-destructive !text-background',
            })
            break
          default:
            toast.error(
              'An unexpected error occurred. Please try again later.',
              {
                className: '!bg-destructive !text-background',
              },
            )
            break
        }
      },
      onSuccess: () => {
        toast.success('Account created successfully. Please log in.', {
          className: '!bg-emerald-500 !text-background',
          duration: 4500,
        })

        form.reset()

        setTimeout(() => {
          useSignIn.reset()
          useSignUp.reset()
        }, 5000)

        useSignOut.reset()

        setTimeout(() => {
          window.location.reload()
        }, 5000)
      },
    })
  }

  return (
    <TabsContent value={tab}>
      <Card>
        <CardHeader>
          <CardTitle>Sign-up</CardTitle>
          <CardDescription>
            Create an account to start using our service.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="********"
                          {...field}
                        />
                        <button
                          type="button"
                          className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          tabIndex={-1}
                          aria-label={
                            showConfirmPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                          title={
                            showConfirmPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="id_department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <DepartmentCombobox field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="pt-6">
              <Button
                className="max-xs:w-full"
                type="submit"
                disabled={
                  useSignUp.isPending ||
                  form.formState.isSubmitting ||
                  useSignUp.isSuccess
                }
              >
                {useSignUp.isPending || form.formState.isSubmitting
                  ? 'Signing up...'
                  : 'Sign up'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </TabsContent>
  )
}
