// src/app/(private)/tickets/FacetedFilterProps.tsx

import { Separator } from '@radix-ui/react-separator'
import { Check, PlusCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface FacetedFilterProps {
  title: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  selected: string[]
  onChange: (selected: string[]) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FacetedFilter({
  title,
  options,
  onOpenChange,
  open,
  selected,
  onChange,
}: FacetedFilterProps) {
  const selectedValues = new Set(selected)

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />

              {/* 🔢 Always show numeric badge on small screens */}
              <Badge
                variant="secondary"
                className="block rounded-sm px-1 font-normal sm:hidden"
              >
                {selectedValues.size} selected
              </Badge>

              {/* 💻 Show content for screens ≥ small */}
              <div className="hidden items-center space-x-1 sm:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  // 🏷️ Show individual badges for 1 or 2 selections
                  Array.from(selectedValues).map((value) => (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal capitalize"
                    >
                      {options.find((o) => o.value === value)?.label}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-xs:w-full w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Filter by ${title}`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const updated = new Set(selectedValues)
                      if (isSelected) {
                        updated.delete(option.value)
                      } else {
                        updated.add(option.value)
                      }
                      onChange(Array.from(updated))
                    }}
                  >
                    <div
                      className={cn(
                        'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <Check className="text-background h-4 w-4" />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
                    )}
                    <span className="capitalize">{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  {/* 🧹 Clear all filters */}
                  <CommandItem
                    onSelect={() => onChange([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
