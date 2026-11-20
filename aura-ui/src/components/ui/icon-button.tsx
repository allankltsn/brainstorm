import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type IconButtonProps = React.ComponentProps<typeof Button> & {
  /** Accessible name applied as `aria-label` (required for icon-only buttons). */
  label: string
  /** When truthy, wrap the button in a tooltip showing the given string or the label. */
  tooltip?: boolean | string
}

function IconButton({
  className,
  label,
  tooltip,
  size = "icon-sm",
  variant,
  children,
  ...props
}: IconButtonProps) {
  const button = (
    <Button
      data-slot="icon-button"
      aria-label={label}
      size={size}
      variant={variant}
      className={cn(className)}
      {...props}
    >
      {children}
    </Button>
  )

  if (!tooltip) {
    return button
  }

  const tooltipText = typeof tooltip === "string" ? tooltip : label

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { IconButton }
