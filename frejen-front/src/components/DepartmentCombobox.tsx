// src/components/DepartmentComboBox.tsx

'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { useRef, useState } from 'react'
import { ControllerRenderProps } from 'react-hook-form'

import { ProfileSchema } from '@/app/(private)/profile/ProfileForm'
import { EditTicketSchema } from '@/app/(private)/tickets/[ticket]/edit/EditTicketContainer'
import { CreateTicketSchema } from '@/app/(private)/tickets/new/NewTicketContainer'
import { SignUpSchema } from '@/app/(public)/auth/SignUpContainer'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useDepartments } from '@/hooks/useDepartments'
import { cn } from '@/lib/utils'

interface DepartmentComboboxProps {
  field:
    | ControllerRenderProps<SignUpSchema, 'id_department'>
    | ControllerRenderProps<ProfileSchema, 'id_department'>
    | ControllerRenderProps<CreateTicketSchema, 'id_department'>
    | ControllerRenderProps<EditTicketSchema, 'newDepartment'>
}

export function DepartmentCombobox({ field }: DepartmentComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDepartments(search)

  const departments = (data?.pages ?? []).flatMap((page) => page.departments)
  const selected = departments.find((d) => d.id === field.value)

  const handleScroll = () => {
    const listElement = listRef.current

    if (
      listElement &&
      listElement.scrollTop + listElement.clientHeight >=
        listElement.scrollHeight
    ) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected ? selected.title : 'Select department...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-xs:max-w-56 w-[200px] p-0 max-sm:w-md">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search department..."
            onValueChange={(value) => setSearch(value)}
          />
          <CommandList ref={listRef} onScroll={handleScroll}>
            <CommandEmpty>No department found.</CommandEmpty>
            <CommandGroup>
              {departments.map((department) => (
                <CommandItem
                  key={department.id}
                  value={department.title.toLowerCase()}
                  onSelect={() => {
                    field.onChange(department.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      field.value === department.id
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {department.title}
                </CommandItem>
              ))}
            </CommandGroup>
            {isFetchingNextPage && (
              <CommandItem disabled>Loading more...</CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
