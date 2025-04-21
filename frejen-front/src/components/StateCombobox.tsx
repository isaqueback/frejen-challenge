// src/components/StateCombobox.tsx

'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { useRef, useState } from 'react'
import { ControllerRenderProps } from 'react-hook-form'

import { EditTicketSchema } from '@/app/(private)/tickets/[ticket]/edit/EditTicketContainer'
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
import { useTicketStates } from '@/hooks/useStates'
import { cn } from '@/lib/utils'

interface StateComboboxProps {
  field: ControllerRenderProps<EditTicketSchema, 'newState'>
}

export function StateCombobox({ field }: StateComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const { data: states } = useTicketStates()

  const stateOptions =
    states?.map((state) => ({
      label: state.title.replaceAll('_', ' ').toLowerCase(),
      value: state.id,
    })) ?? []

  const filteredStates = stateOptions.filter((state) =>
    state.label.includes(search),
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between capitalize"
        >
          {stateOptions.find((s) => s.value === Number(field.value))?.label ??
            'Select state...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-xs:max-w-56 w-[200px] p-0 max-sm:w-md">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search state..."
            onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          />
          <CommandList ref={listRef}>
            <CommandEmpty>No state found.</CommandEmpty>
            <CommandGroup>
              {filteredStates.map((state) => (
                <CommandItem
                  className="capitalize"
                  key={state.value}
                  value={state.label}
                  onSelect={() => {
                    field.onChange(state.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      Number(field.value) === state.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {state.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
