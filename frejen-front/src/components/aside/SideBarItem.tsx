// src/components/aside/SideBarItem.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { SidebarGroup, SidebarGroupLabel } from '../ui/sidebar'
import { Item } from './Aside'

type SideBarItemProps = Omit<Item, 'children'>

export function SideBarItem({ title, url, icon: Icon }: SideBarItemProps) {
  const pathname = usePathname()

  const isActive = pathname === url

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupLabel asChild>
        <Link
          href={url!}
          className="group/label hover:text-primary flex items-center gap-2"
        >
          <Icon
            className={`group-hover/label:text-primary !size-6 transition-all ${isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground'}`}
          />
          <span
            className={`group-hover/label:text-primary text-base font-semibold transition-all ${isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground'}`}
          >
            {title}
          </span>
        </Link>
      </SidebarGroupLabel>
    </SidebarGroup>
  )
}
