"use client"

import * as React from "react"
import { CheckIcon, CircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

export type ProgressStep = {
  id: string
  label: string
  done?: boolean
  /** Small icon on the right, e.g. the app the step belongs to */
  icon?: React.ReactNode
}

export type ProgressTrackerProps = {
  title?: string
  steps: ProgressStep[]
  /** Ticks the open steps one after another, then starts over – stops as soon as someone interacts */
  autoPlay?: boolean
  /** Pause between two automatic steps, in ms */
  interval?: number
  onChange?: (steps: ProgressStep[]) => void
  className?: string
}

// 1284 → "1,284"
const num = new Intl.NumberFormat("en")

export function ProgressTracker({
  title = "Primeiros passos",
  steps: initial,
  autoPlay = false,
  interval = 2200,
  onChange,
  className,
}: ProgressTrackerProps) {
  const [done, setDone] = React.useState(
    () => new Set(initial.filter((s) => s.done).map((s) => s.id))
  )
  const [playing, setPlaying] = React.useState(autoPlay)

  // Steps added later bring their own done state; steps that go away no longer count
  const seen = React.useRef(new Set(initial.map((s) => s.id)))
  const ids = initial.map((s) => s.id).join("|")
  React.useEffect(() => {
    const fresh = initial.filter((s) => !seen.current.has(s.id))
    fresh.forEach((s) => seen.current.add(s.id))
    if (fresh.some((s) => s.done))
      setDone(
        (prev) =>
          new Set([
            ...prev,
            ...fresh.filter((s) => s.done).map((s) => s.id),
          ])
      )
  }, [ids]) // eslint-disable-line react-hooks/exhaustive-deps

  const total = initial.length
  const count = initial.filter((s) => done.has(s.id)).length
  const progress = total ? (count / total) * 100 : 0

  const toggle = (id: string) => {
    const next = new Set(done)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setDone(next)
    onChange?.(initial.map((s) => ({ ...s, done: next.has(s.id) })))
  }

  // Auto play: tick the next open step; when all are done, start over
  React.useEffect(() => {
    if (!playing) return
    const open = initial.find((s) => !done.has(s.id))
    const t = window.setTimeout(
      () => {
        if (open) toggle(open.id)
        else setDone(new Set(initial.filter((s) => s.done).map((s) => s.id)))
      },
      open ? interval : interval * 2
    )
    return () => clearTimeout(t)
  }, [playing, done]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      data-slot="progress-tracker"
      data-complete={count === total || undefined}
      className={cn(
        "w-full max-w-sm rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm",
        className
      )}
      onPointerDown={() => setPlaying(false)}
      onKeyDown={() => setPlaying(false)}
    >
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h3
          dir="auto"
          title={title}
          className="min-w-0 truncate text-base font-medium tracking-tight"
        >
          {title}
        </h3>
        <span
          aria-hidden="true"
          className="whitespace-nowrap text-sm tabular-nums text-muted-foreground"
        >
          {num.format(count)}/{num.format(total)}
        </span>
      </div>

      <Progress
        value={progress}
        aria-label={title}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={count}
        aria-valuetext={`${num.format(count)} de ${num.format(total)} feitos`}
        className="my-3"
      />

      <ul className="flex flex-col gap-0.5">
        {initial.map((step) => {
          const checked = done.has(step.id)
          return (
            <li key={step.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggle(step.id)}
                className="flex w-full items-center gap-3 rounded-lg px-1.5 py-2 text-left text-sm transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span aria-hidden="true" className="flex shrink-0">
                  {checked ? (
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckIcon className="size-3" />
                    </span>
                  ) : (
                    <span className="flex size-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground/40">
                      <CircleIcon className="size-2 fill-current" />
                    </span>
                  )}
                </span>
                <span
                  title={step.label || undefined}
                  className={cn(
                    "min-w-0 flex-1 truncate",
                    checked && "text-muted-foreground line-through"
                  )}
                >
                  <span dir="auto">{step.label || " "}</span>
                </span>
                {step.icon && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-[18px] shrink-0 items-center justify-center overflow-hidden [&_img]:size-full [&_img]:object-contain [&_svg]:size-full",
                      checked && "opacity-45"
                    )}
                  >
                    {step.icon}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
