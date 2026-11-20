"use client"

import * as React from "react"
import { FilterIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type FilterOption = {
  id: string
  label: string
}

type FilterGroup = {
  id: string
  label: string
  options: FilterOption[]
}

type FilterMenuProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  groups: FilterGroup[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (ids: string[]) => void
}

function FilterMenu({
  groups,
  value,
  defaultValue,
  onValueChange,
  className,
  ...props
}: FilterMenuProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<string[]>(
    defaultValue ?? []
  )
  const selected = isControlled ? value : internalValue

  const setSelected = React.useCallback(
    (next: string[]) => {
      if (!isControlled) {
        setInternalValue(next)
      }
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  const toggle = React.useCallback(
    (id: string) => {
      const next = selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id]
      setSelected(next)
    },
    [selected, setSelected]
  )

  const optionById = React.useMemo(() => {
    const map = new Map<string, FilterOption>()
    for (const group of groups) {
      for (const option of group.options) {
        map.set(option.id, option)
      }
    }
    return map
  }, [groups])

  const activeCount = selected.length

  return (
    <div
      data-slot="filter-menu"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" data-slot="filter-menu-trigger">
            <FilterIcon />
            Filtros
            {activeCount > 0 ? (
              <Badge
                variant="secondary"
                data-slot="filter-menu-count"
                className="ml-0.5"
              >
                {activeCount}
              </Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          data-slot="filter-menu-content"
          className="w-64 p-0"
        >
          <div className="flex max-h-80 flex-col gap-3 overflow-y-auto p-3">
            {groups.map((group) => (
              <div
                key={group.id}
                data-slot="filter-menu-group"
                className="flex flex-col gap-1.5"
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {group.label}
                </span>
                {group.options.map((option) => {
                  const optionId = `${group.id}-${option.id}`
                  const checked = selected.includes(option.id)
                  return (
                    <label
                      key={option.id}
                      htmlFor={optionId}
                      data-slot="filter-menu-option"
                      className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-sm text-foreground hover:bg-muted"
                    >
                      <Checkbox
                        id={optionId}
                        checked={checked}
                        onCheckedChange={() => toggle(option.id)}
                      />
                      {option.label}
                    </label>
                  )
                })}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {selected.map((id) => {
        const option = optionById.get(id)
        if (!option) return null
        return (
          <Badge
            key={id}
            variant="secondary"
            data-slot="filter-menu-chip"
            className="gap-1 pr-1"
          >
            {option.label}
            <button
              type="button"
              aria-label={`Remover ${option.label}`}
              data-slot="filter-menu-chip-remove"
              onClick={() => toggle(id)}
              className="inline-flex size-3.5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              <XIcon className="size-3" />
            </button>
          </Badge>
        )
      })}
    </div>
  )
}

export { FilterMenu }
export type { FilterMenuProps, FilterGroup, FilterOption }
