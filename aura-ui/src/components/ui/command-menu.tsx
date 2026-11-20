"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command"

type CommandMenuItem = {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  onSelect?: () => void
}

type CommandMenuGroup = {
  heading: string
  items: CommandMenuItem[]
}

type CommandMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: CommandMenuGroup[]
  placeholder?: string
  emptyMessage?: string
  className?: string
}

function CommandMenu({
  open,
  onOpenChange,
  groups,
  placeholder = "Digite um comando ou busque…",
  emptyMessage = "Nenhum resultado.",
  className,
}: CommandMenuProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command data-slot="command-menu" className={cn(className)}>
        <CommandInput placeholder={placeholder} />
        <CommandList>
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group.heading} heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.label}
                  onSelect={() => {
                    item.onSelect?.()
                    onOpenChange(false)
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <CommandShortcut>{item.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

function useCommandMenu() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return { open, setOpen }
}

export { CommandMenu, useCommandMenu }
