"use client"

import * as React from "react"
import { Check, LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"

/*
 * Thinking Loader – a small "the model is working" pill.
 * A spinner and a label that walks through phases (Thinking → Searching the web → …):
 * the old label rolls up and the new one rolls in. When done, the spinner turns into a
 * check and the label settles on a "done" message with the elapsed time.
 * Reimplemented in the aura-ui kit style: Tailwind + semantic tokens, no inline CSS vars.
 */

export type ThinkingLoaderProps = {
  /** Labels to walk through, one after another */
  phases?: string[]
  /** Time per phase, in ms */
  interval?: number
  /** Show a specific phase instead of advancing on a timer – e.g. from your stream events */
  phase?: number
  /** Start over after the last phase instead of holding it */
  loop?: boolean
  /** Finished: the spinner turns into a check and the label into doneLabel */
  done?: boolean
  /** Label once done – a string, or a function that gets the seconds since the loader started */
  doneLabel?: string | ((seconds: number) => string)
  size?: "sm" | "md"
  /** "pill" = bordered capsule, "plain" = just the spinner and the label, e.g. inside a chat bubble */
  variant?: "pill" | "plain"
  className?: string
}

const DEFAULT_PHASES = [
  "Thinking",
  "Searching the web",
  "Reading sources",
  "Writing response",
]

// 75s reads "1m 15s", a long run "2h 05m" or "3d 4h"
const took = (s: number) => {
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ${s % 60}s`
  const h = Math.floor(m / 60)
  return h < 24
    ? `${h}h ${String(m % 60).padStart(2, "0")}m`
    : `${Math.floor(h / 24)}d ${h % 24}h`
}

function ThinkingLoader({
  phases: phasesProp = DEFAULT_PHASES,
  interval: intervalProp = 2200,
  phase,
  loop = false,
  done = false,
  doneLabel = (s) => `Pronto em ${took(s)}`,
  size = "md",
  variant = "pill",
  className,
}: ThinkingLoaderProps) {
  // An empty or missing list still says something; 0 or NaN never spins the timer every frame
  const given = Array.isArray(phasesProp)
    ? phasesProp.map((p) => String(p ?? ""))
    : []
  const phases = given.length ? given : DEFAULT_PHASES.slice(0, 1)
  const interval =
    Number.isFinite(intervalProp) && intervalProp > 0
      ? Math.max(intervalProp, 200)
      : 2200

  const [step, setStep] = React.useState(0)
  const [started, setStarted] = React.useState(() => Date.now())
  const [seconds, setSeconds] = React.useState<number | null>(null)

  // Read the clock in the same render that turns done on – and restart it when work starts again
  const elapsed = seconds ?? Math.max(1, Math.round((Date.now() - started) / 1000))
  if (done && seconds === null) setSeconds(elapsed)
  if (!done && seconds !== null) {
    setSeconds(null)
    setStarted(Date.now())
    setStep(0)
  }

  // Advance through the phases on a timer – unless the phase is controlled
  React.useEffect(() => {
    if (done || (phase !== undefined && Number.isFinite(phase)) || phases.length < 2)
      return
    const id = window.setInterval(() => {
      setStep((s) => (s + 1 < phases.length ? s + 1 : loop ? 0 : s))
    }, interval)
    return () => window.clearInterval(id)
  }, [done, phase, phases.length, interval, loop])

  const wanted =
    phase !== undefined && Number.isFinite(phase) ? Math.floor(phase) : step
  const index = Math.min(Math.max(wanted, 0), Math.max(phases.length - 1, 0))
  const label = String(
    (done
      ? typeof doneLabel === "function"
        ? doneLabel(elapsed)
        : doneLabel
      : phases[index]) ?? "",
  )

  // The label on screen and the one rolling out – swapped during render so both animate in the same frame
  const [shown, setShown] = React.useState({ key: 0, text: label })
  const [leaving, setLeaving] = React.useState<{ key: number; text: string } | null>(
    null,
  )
  if (label !== shown.text) {
    setLeaving(shown)
    setShown({ key: shown.key + 1, text: label })
  }

  const compact = size === "sm"

  return (
    <span
      data-slot="thinking-loader"
      data-size={size}
      data-variant={variant}
      data-done={done || undefined}
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex max-w-full select-none items-center align-middle font-medium leading-none tracking-tight text-muted-foreground",
        compact ? "gap-1.5 text-[0.8rem]" : "gap-2 text-sm",
        variant === "pill" &&
          cn(
            "rounded-full border border-border bg-background bg-clip-padding shadow-xs",
            compact ? "h-7 pr-3 pl-2.5" : "h-8 pr-3.5 pl-3",
          ),
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative flex-none text-foreground",
          compact ? "size-3.5" : "size-4",
        )}
      >
        <LoaderCircle
          className={cn(
            "absolute inset-0 size-full animate-spin transition-all duration-300 motion-reduce:animate-none",
            done && "scale-50 opacity-0",
          )}
        />
        <Check
          className={cn(
            "absolute inset-0 size-full scale-50 opacity-0 transition-all duration-300",
            done && "scale-100 opacity-100",
          )}
          strokeWidth={2.5}
        />
      </span>

      {/* The text box glides to the width of the incoming label; labels roll through it */}
      <span className="relative block h-[1.3em] min-w-0 overflow-hidden">
        {leaving && (
          <span
            key={leaving.key}
            aria-hidden="true"
            dir="auto"
            onAnimationEnd={() => setLeaving(null)}
            className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap animate-out fade-out slide-out-to-top-2 fill-mode-both duration-300 motion-reduce:animate-none"
          >
            {leaving.text}
          </span>
        )}
        <span
          key={shown.key}
          dir="auto"
          title={shown.text}
          className={cn(
            "flex max-w-full items-center overflow-hidden text-ellipsis whitespace-nowrap",
            done && "text-foreground",
            shown.key > 0 &&
              "animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300 motion-reduce:animate-none",
          )}
        >
          {shown.text}
        </span>
      </span>
    </span>
  )
}

export { ThinkingLoader }
