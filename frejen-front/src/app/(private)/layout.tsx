// src/app/(private)/layout.tsx

import { ReactNode } from 'react'

import { Aside } from '@/components/aside/Aside'
import { CheckAuth } from '@/components/CheckAuth'
import { PrivateHeader } from '@/components/header/PrivateHeader'
import { SidebarProvider } from '@/components/ui/sidebar'
import { TicketProvider } from '@/contexts/TicketContext'

interface PrivateRouteLayoutProps {
  children: ReactNode
}

export default async function PrivateRouteLayout({
  children,
}: PrivateRouteLayoutProps) {
  return (
    <SidebarProvider>
      <TicketProvider>
        <CheckAuth />
        <div className="flex w-full">
          <Aside />
          <div className="flex w-full flex-col">
            <PrivateHeader />
            {children}
          </div>
        </div>
      </TicketProvider>
    </SidebarProvider>
  )
}
