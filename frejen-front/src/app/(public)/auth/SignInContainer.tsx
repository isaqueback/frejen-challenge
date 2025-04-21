'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

interface SignInContainerProps {
  tab: string
}

const signInSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email' }),
  password: z.string(),
})

type SignInSchema = z.infer<typeof signInSchema>

export function SignInContainer({ tab }: SignInContainerProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const { useSignIn, useSignOut, useSignUp } = useContext(AuthContext)

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  function onSubmit(data: SignInSchema) {
    const showErrorToast = (message: string) => {
      toast.error(message, {
        className: '!bg-destructive !text-background',
      })
    }

    useSignIn.mutate(data, {
      onSuccess: () => {
        toast.success('Login successful!', {
          className: '!bg-emerald-500 !text-background',
          duration: 2000,
          description: 'You will be redirected shortly.',
          descriptionClassName: '!bg-emerald-500 !text-background',
        })

        form.reset()
        useSignOut.reset()

        setTimeout(() => {
          useSignIn.reset()
          useSignUp.reset()
        }, 5000)

        router.push('/')
      },
      onError: (error) => {
        switch (error.statusCode) {
          case 401:
          case 404:
          case 422:
            showErrorToast('Invalid email or password.')
            break
          default:
            showErrorToast(
              'An unexpected error occurred. Please try again later.',
            )
            break
        }
      },
    })
  }

  return (
    <TabsContent value={tab}>
      <Card>
        <CardHeader>
          <CardTitle>Sign-in</CardTitle>
          <CardDescription>
            Enter your email and password to sign in.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
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
                          onClick={() => setShowPassword(!showPassword)}
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
            </CardContent>
            <CardFooter className="pt-6">
              <Button
                className="max-xs:w-full"
                type="submit"
                disabled={
                  useSignIn.isPending ||
                  form.formState.isSubmitting ||
                  useSignIn.isSuccess
                }
              >
                {useSignIn.isPending || form.formState.isSubmitting
                  ? 'Signing in...'
                  : 'Sign in'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </TabsContent>
  )
}
