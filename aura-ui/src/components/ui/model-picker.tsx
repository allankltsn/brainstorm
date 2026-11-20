import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ModelOption = {
  id: string
  label: string
  provider?: string
  badge?: string
  disabled?: boolean
}

function ModelPicker({
  models,
  value,
  onValueChange,
  className,
}: {
  models: ModelOption[]
  value?: string
  onValueChange?: (id: string) => void
  className?: string
}) {
  const [internalValue, setInternalValue] = React.useState(value)
  const selectedId = value ?? internalValue
  const selected = models.find((model) => model.id === selectedId)

  function handleSelect(id: string) {
    if (value === undefined) setInternalValue(id)
    onValueChange?.(id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          data-slot="model-picker"
          className={cn("justify-between font-normal", className)}
        >
          {selected?.label ?? "Escolher modelo"}
          <ChevronsUpDownIcon className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            disabled={model.disabled}
            onSelect={() => handleSelect(model.id)}
          >
            <CheckIcon
              className={cn(
                "text-primary",
                model.id === selectedId ? "opacity-100" : "opacity-0"
              )}
            />
            <span className="flex-1">{model.label}</span>
            {model.provider ? (
              <span className="text-xs text-muted-foreground">
                {model.provider}
              </span>
            ) : null}
            {model.badge ? (
              <Badge variant="secondary">{model.badge}</Badge>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ModelPicker, type ModelOption }
