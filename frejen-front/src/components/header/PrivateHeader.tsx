// src/components/header/PrivateHeader.tsx

'use client'

import { SidebarTrigger, useSidebar } from '../ui/sidebar'

export function PrivateHeader() {
  const { open, isMobile } = useSidebar()

  return (
    <header className={`flex h-16 w-full items-center bg-white px-8`}>
      <SidebarTrigger
        className={`bg-background hover:bg-background size-8 opacity-100 transition-transform duration-500 ${!isMobile && open ? 'absolute -z-10 -rotate-180 opacity-0' : ''}`}
      />
    </header>
  )
}
