// src/components/PageNavigation.tsx

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { Skeleton } from './ui/skeleton'

export type BreadcrumbLink = { label: string; href: string }

interface PageNavigationProps {
  title: string
  breadcrumbLinks: BreadcrumbLink[]
}

export function PageNavigation({
  breadcrumbLinks,
  title,
}: PageNavigationProps) {
  return (
    <section className="flex justify-between pb-8 max-md:flex-col">
      {title ? (
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      ) : (
        <Skeleton className="h-8 w-48 bg-neutral-300 duration-1000" />
      )}
      <div className="flex items-center gap-2">
        {breadcrumbLinks.map((link, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {link.href.length > 0 ? (
              link.label ? (
                <Link
                  className="text-muted-foreground w-full max-w-28 truncate"
                  key={idx}
                  href={link.href}
                >
                  {link.label}
                </Link>
              ) : (
                <Skeleton className="h-5 w-16 bg-neutral-300 duration-1000" />
              )
            ) : link.label ? (
              <span className="w-full max-w-28 truncate">{link.label}</span>
            ) : (
              <Skeleton className="h-5 w-24 bg-neutral-300 duration-1000" />
            )}
            {breadcrumbLinks.length - 1 !== idx && (
              <ChevronRight className="size-3" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
