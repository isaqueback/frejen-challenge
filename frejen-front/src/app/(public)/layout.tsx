// src/app/(public)/layout.tsx

import { ReactNode } from 'react'

import { PublicHeader } from '@/components/header/PublicHeader'

interface PublicRouteLayoutProps {
  children: ReactNode
}

export default function PublicRouteLayout({
  children,
}: PublicRouteLayoutProps) {
  return (
    <div className="flex w-full">
      <div className="flex w-full flex-col">
        <PublicHeader />
        {children}
      </div>
    </div>
  )
}
