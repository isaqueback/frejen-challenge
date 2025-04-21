// src/components/aside/Aside.tsx

'use client'

import {
  ChevronRight,
  ChevronUp,
  LogOut,
  NotepadTextDashed,
  User2,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ComponentType, useContext } from 'react'
import { toast } from 'sonner'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { AuthContext } from '@/contexts/AuthContext'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

type ItemChild = {
  title: string
  url: string
}

export type Item = {
  icon: ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  url?: string
  children?: ItemChild[]
}

const items: Item[] = [
  {
    title: 'Tickets',
    icon: NotepadTextDashed,
    children: [
      { title: 'All Tickets', url: '/' },
      { title: 'New Ticket', url: '/tickets/new' },
    ],
  },
]

export function Aside() {
  const router = useRouter()
  const { open } = useSidebar()

  const authContext = useContext(AuthContext)
  const pathname = usePathname()

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider')
  }

  const { useSignOut, user, useSignIn, useSignUp } = authContext

  async function handleSignOut() {
    useSignOut.mutate(undefined, {
      onSettled: () => {
        toast.success('You signed out successfully!', {
          description: 'You will be redirected shortly.',
          descriptionClassName: '!text-background',
          className: '!bg-emerald-500 !text-background',
          duration: 2000,
        })

        useSignIn.reset()
        useSignUp.reset()

        router.push('/auth')
      },
    })
  }

  return (
    <Sidebar className="border-dashed">
      <SidebarHeader className="flex h-16 flex-row items-center justify-between bg-white">
        <h1 className="mx-auto text-xl font-bold">Panel</h1>
        <SidebarTrigger
          className={`bg-background hover:bg-background size-8 opacity-100 transition-transform duration-500 ${
            open ? '' : 'absolute -z-10 rotate-180 opacity-0'
          }`}
        />
      </SidebarHeader>
      <SidebarContent className="bg-white px-2">
        <SidebarMenu>
          {items.map((item, index) => {
            if (item.children) {
              return (
                <Collapsible
                  key={index}
                  className="group/collapsible"
                  defaultOpen
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={`py-5 ${item.children.some((child) => child.url === pathname) ? 'bg-sidebar-accent font-medium' : ''}`}
                      >
                        <div className="text-foreground flex items-center gap-2 text-base">
                          <item.icon className="mr-2 size-5" strokeWidth={2} />
                          {item.title}
                        </div>
                        <ChevronRight
                          className={`ml-auto transition-all group-data-[state=open]/collapsible:rotate-90`}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {item.children.map((child, childIndex) => (
                        <SidebarMenuSub key={childIndex}>
                          <SidebarMenuSubItem
                            className={`hover:bg-sidebar-accent text-foreground flex rounded-md p-2 text-sm tracking-tight ${
                              pathname === child.url
                                ? 'bg-sidebar-accent font-medium'
                                : ''
                            }`}
                          >
                            <Link className="w-full" href={child.url ?? '#'}>
                              {child.title}
                            </Link>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      ))}
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            }
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:bg-transparent">
                  <User2 /> {user?.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={useSignOut.isPending || useSignOut.isSuccess}
                  className="group hover:!bg-red-50"
                  onClick={() => handleSignOut()}
                >
                  <LogOut className="text-destructive size-4" />
                  <span className="group-hover:text-destructive text-destructive">
                    Sign out
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
