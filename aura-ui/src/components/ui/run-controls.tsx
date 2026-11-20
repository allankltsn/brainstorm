"use client"

import * as React from "react"
import {
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  SquareIcon,
  StepForwardIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { IconButton } from "@/components/ui/icon-button"
import { Spinner } from "@/components/ui/spinner"

type RunStatus = "idle" | "running" | "paused" | "done" | "error"

type RunControlsProps = React.ComponentProps<"div"> & {
  status: RunStatus
  onPlay?: () => void
  onPause?: () => void
  onStop?: () => void
  onStep?: () => void
  onReset?: () => void
}

const statusConfig: Record<
  RunStatus,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  idle: { label: "Ocioso", variant: "secondary" },
  running: { label: "Executando", variant: "default" },
  paused: { label: "Pausado", variant: "outline" },
  done: { label: "Concluído", variant: "secondary" },
  error: { label: "Erro", variant: "destructive" },
}

function RunControls({
  className,
  status,
  onPlay,
  onPause,
  onStop,
  onStep,
  onReset,
  ...props
}: RunControlsProps) {
  const isRunning = status === "running"
  const isPaused = status === "paused"
  const canPlay = status === "idle" || isPaused || status === "done"
  const canStop = isRunning || isPaused
  const { label, variant } = statusConfig[status]

  return (
    <div
      data-slot="run-controls"
      role="toolbar"
      aria-label="Controles de execução"
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-border bg-background p-1.5",
        className
      )}
      {...props}
    >
      <Badge variant={variant} className="gap-1">
        {isRunning ? <Spinner className="size-3 text-current" /> : null}
        {label}
      </Badge>

      {isRunning ? (
        <IconButton
          label="Pausar"
          variant="ghost"
          onClick={onPause}
          disabled={!isRunning}
        >
          <PauseIcon />
        </IconButton>
      ) : (
        <IconButton
          label="Reproduzir"
          variant="ghost"
          onClick={onPlay}
          disabled={!canPlay}
        >
          <PlayIcon />
        </IconButton>
      )}

      <IconButton
        label="Passo"
        variant="ghost"
        onClick={onStep}
        disabled={isRunning}
      >
        <StepForwardIcon />
      </IconButton>

      <IconButton
        label="Parar"
        variant="ghost"
        onClick={onStop}
        disabled={!canStop}
      >
        <SquareIcon />
      </IconButton>

      <IconButton
        label="Reiniciar"
        variant="ghost"
        onClick={onReset}
        disabled={isRunning}
      >
        <RotateCcwIcon />
      </IconButton>
    </div>
  )
}

export { RunControls }
