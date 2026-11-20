import * as React from "react"
import { CheckIcon, ChevronDownIcon, SparklesIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type Recommendation = {
  id: string
  /** Short name, used in the accept button, e.g. "Incremental sync" */
  label: string
  /** One sentence why – shown in the card */
  reason: React.ReactNode
  /** 0 = no signal, 1 = weak, 2 = good, 3 = strong */
  signal: 0 | 1 | 2 | 3
}

export type SmartRecommendationProps = {
  title?: string
  /** First entry is the recommendation, the rest are offered as alternatives */
  options: Recommendation[]
  onAccept?: (option: Recommendation) => void
  onUndo?: (option: Recommendation) => void
  defaultOpen?: boolean
  className?: string
}

const signalText = [
  "Sem indicação",
  "Indicação fraca",
  "Indicação boa",
  "Indicação forte",
]

/** Any signal outside 0–3 (NaN, "3", 7, -1) is read as the nearest valid level, NaN as no signal */
const level = (s: unknown): 0 | 1 | 2 | 3 => {
  const n = Math.round(Number(s))
  return (Number.isFinite(n) ? Math.min(3, Math.max(0, n)) : 0) as 0 | 1 | 2 | 3
}

/** "Incremental sync" → "incremental sync", but "AWS backup" and "S3 sync" keep their capitals */
const lowerFirst = (s: string) =>
  /^\p{Lu}\p{Ll}/u.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s

/** Per-level color for an "on" confidence bar, using the kit's semantic tokens */
const barColor = ["bg-muted-foreground", "bg-warning", "bg-info", "bg-success"]

function SignalBars({
  signal,
  className,
}: {
  signal: 0 | 1 | 2 | 3
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex items-end gap-0.5", className)}
    >
      {[1, 2, 3].map((n) => {
        const on = signal >= n
        return (
          <span
            key={n}
            className={cn(
              "w-[3px] rounded-[1px] transition-colors",
              n === 1 ? "h-1.5" : n === 2 ? "h-2.5" : "h-3",
              on ? barColor[signal] : "bg-border"
            )}
          />
        )
      })}
    </span>
  )
}

function SmartRecommendation({
  title = "Sugestão",
  options,
  onAccept,
  onUndo,
  defaultOpen = true,
  className,
}: SmartRecommendationProps) {
  // By position, so two options with the same id stay apart
  const [chosen, setChosen] = React.useState(0)
  const [accepted, setAccepted] = React.useState<number | null>(null)
  const [open, setOpen] = React.useState(defaultOpen)
  const [menu, setMenu] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!menu) return
    const away = (e: PointerEvent) =>
      !menuRef.current?.contains(e.target as Node) && setMenu(false)
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false)
    window.addEventListener("pointerdown", away)
    window.addEventListener("keydown", esc)
    return () => {
      window.removeEventListener("pointerdown", away)
      window.removeEventListener("keydown", esc)
    }
  }, [menu])

  const at = chosen < options.length ? chosen : 0
  const current = options[at]
  // Nothing to recommend – render nothing rather than crash
  if (!current) return null
  const isRecommended = at === 0
  const done = accepted === at
  const signal = level(current.signal)
  const acceptText = `Aplicar: ${lowerFirst(String(current.label))}`

  return (
    <Card
      data-slot="smart-recommendation"
      aria-label={title}
      data-accepted={done || undefined}
      className={cn("w-full max-w-[440px] gap-0 py-0", className)}
    >
      <CardHeader className="p-0">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-2.5 rounded-t-xl px-3 py-2.5 text-left transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <SparklesIcon className="size-4 shrink-0 text-brand-text" />
          <span
            dir="auto"
            title={title}
            className="min-w-0 flex-1 truncate font-heading text-sm font-medium text-foreground"
          >
            {title}
          </span>
          {!isRecommended ? (
            <Badge className="bg-brand-soft text-brand-text">Outra opção</Badge>
          ) : null}
          <ChevronDownIcon
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              !open && "-rotate-90"
            )}
          />
        </button>
      </CardHeader>

      <CardContent
        inert={!open ? true : undefined}
        className={cn(
          "grid px-3 transition-all",
          open
            ? "grid-rows-[1fr] pb-3 opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <p
          key={at}
          dir="auto"
          className="min-h-0 overflow-hidden text-sm leading-relaxed text-muted-foreground [&_strong]:font-medium [&_strong]:text-foreground"
        >
          {current.reason}
        </p>
      </CardContent>

      <CardFooter className="flex-wrap justify-between gap-x-3 gap-y-2 border-t bg-muted/50 px-3 py-2.5">
        <span
          title={signalText[signal]}
          className="inline-flex items-center gap-2 text-xs whitespace-nowrap text-muted-foreground"
        >
          <SignalBars signal={signal} />
          {signalText[signal]}
        </span>

        <div className="ml-auto flex min-w-0 items-center gap-1.5">
          {options.length > 1 && !done ? (
            <div className="relative" ref={menuRef}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-haspopup="menu"
                aria-expanded={menu}
                onClick={() => setMenu((m) => !m)}
              >
                Outras opções
              </Button>
              {menu ? (
                <div
                  role="menu"
                  className="absolute right-0 bottom-[calc(100%+0.5rem)] z-10 grid max-h-[min(320px,60vh)] w-64 gap-0.5 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg"
                >
                  {options.map((o, i) => (
                    <button
                      key={`${o.id}-${i}`}
                      type="button"
                      role="menuitemradio"
                      aria-checked={i === at}
                      onClick={() => {
                        setChosen(i)
                        setMenu(false)
                        setOpen(true)
                      }}
                      className={cn(
                        "flex min-h-8 items-center justify-between gap-2.5 rounded-md px-2.5 text-left text-sm outline-none transition-colors hover:bg-muted focus-visible:bg-muted",
                        i === at && "bg-brand-soft"
                      )}
                    >
                      <span className="inline-flex min-w-0 items-center gap-1.5">
                        <span
                          dir="auto"
                          title={o.label}
                          className="min-w-0 truncate text-foreground"
                        >
                          {o.label}
                        </span>
                        {i === 0 ? (
                          <Badge
                            variant="outline"
                            className="border-transparent bg-brand-soft text-brand-text"
                          >
                            Recomendada
                          </Badge>
                        ) : null}
                      </span>
                      <SignalBars
                        signal={level(o.signal)}
                        className="shrink-0"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {done ? (
            <>
              <span
                role="status"
                className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-success"
              >
                <CheckIcon className="size-3.5 shrink-0" />
                <span
                  className="min-w-0 truncate"
                  title={`${current.label}: aplicado`}
                >
                  <bdi>{current.label}</bdi>: aplicado
                </span>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setAccepted(null)
                  onUndo?.(current)
                }}
              >
                Desfazer
              </Button>
            </>
          ) : (
            <Button
              type="button"
              size="sm"
              title={acceptText}
              onClick={() => {
                setAccepted(at)
                setMenu(false)
                onAccept?.(current)
              }}
            >
              <span className="min-w-0 truncate">{acceptText}</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export { SmartRecommendation }
