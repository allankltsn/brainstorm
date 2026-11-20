import * as React from "react"
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  RefreshCwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Volume2Icon,
  XIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type MessageActionKey = "copy" | "regenerate" | "feedback" | "speak"
export type FeedbackKind = "up" | "down"

export type MessageActionsProps = {
  /** Message text – copied by Copy, and used to estimate Read aloud duration */
  text?: string
  /** Which actions to show, in this order */
  actions?: MessageActionKey[]
  /** All versions of the message, or how many there are. From 2 on, the switcher shows */
  versions?: number | string[]
  /** Controlled version (0-based index) */
  version?: number
  /** Starting version when uncontrolled – defaults to the newest */
  defaultVersion?: number
  /** Called with the version index picked in the switcher */
  onVersionChange?: (index: number) => void
  /** Called after Copy, with `text` */
  onCopy?: (text?: string) => void
  /** Called when Regenerate is pressed */
  onRegenerate?: () => void
  /** Keeps the regenerate arrow spinning while a new version is written */
  regenerating?: boolean
  /** "up"/"down" when pressed, null when taken back, "down" + reason when sent */
  onFeedback?: (kind: FeedbackKind | null, reason?: string) => void
  /** Quick reasons in the feedback row. "Outro" opens a small text field */
  reasons?: string[]
  /** Called with true when Read aloud starts and false when it stops */
  onSpeak?: (playing: boolean) => void
  /** Controlled playing state, e.g. tied to your speech player */
  speaking?: boolean
  /** How long an uncontrolled read aloud plays, in ms – defaults to estimate from `text` */
  speakDuration?: number
  /** Faded until hovered (default true). Put data-ui-message on the message wrapper */
  quiet?: boolean
  /** Accessible name of the bar */
  label?: string
  className?: string
}

const DEFAULT_ACTIONS: MessageActionKey[] = ["copy", "regenerate", "feedback", "speak"]
const DEFAULT_REASONS = ["Not accurate", "Too long", "Didn't follow instructions", "Outro"]

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
const cleanActions = (list: unknown): MessageActionKey[] =>
  Array.isArray(list)
    ? [...new Set(list)].filter((k): k is MessageActionKey =>
        DEFAULT_ACTIONS.includes(k as MessageActionKey)
      )
    : DEFAULT_ACTIONS
const whole = (n: unknown, fb: number) =>
  typeof n === "number" && Number.isFinite(n) ? Math.floor(n) : fb
const fmt = (n: number) => n.toLocaleString("en-US")

/** The message itself, lightly crossfading when `version` changes. */
export function MessageText({
  version,
  children,
  className,
}: {
  version: string | number
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="message-text"
      className={cn("text-sm leading-relaxed [overflow-wrap:anywhere]", className)}
      dir="auto"
    >
      <div key={String(version)} className="animate-in fade-in-0 duration-300">
        {children}
      </div>
    </div>
  )
}

export function MessageActions({
  text,
  actions: actionsProp = DEFAULT_ACTIONS,
  versions,
  version,
  defaultVersion,
  onVersionChange,
  onCopy,
  onRegenerate,
  regenerating = false,
  onFeedback,
  reasons = DEFAULT_REASONS,
  onSpeak,
  speaking,
  speakDuration,
  quiet = true,
  label = "Ações da mensagem",
  className,
}: MessageActionsProps) {
  const uid = React.useId()
  const actions = cleanActions(actionsProp)
  const count = Math.max(
    1,
    whole(typeof versions === "number" ? versions : Array.isArray(versions) ? versions.length : 1, 1)
  )

  const [inner, setInner] = React.useState(() =>
    Math.min(count - 1, Math.max(0, whole(defaultVersion, count - 1)))
  )
  const [seenCount, setSeenCount] = React.useState(count)
  const [vote, setVote] = React.useState<FeedbackKind | null>(null)
  const [panel, setPanel] = React.useState(false)
  const [reason, setReason] = React.useState<string | null>(null)
  const [other, setOther] = React.useState("")
  const [sent, setSent] = React.useState(false)
  const [copied, setCopied] = React.useState(0)
  const [innerSpeaking, setInnerSpeaking] = React.useState(false)
  const [status, setStatus] = React.useState("")
  const downRef = React.useRef<HTMLButtonElement>(null)

  // A new version arrived: show it, with a fresh vote.
  if (seenCount !== count) {
    if (count > seenCount) {
      setInner(count - 1)
      setVote(null)
      setPanel(false)
    }
    setSeenCount(count)
  }

  const announce = (s: string) => setStatus((old) => (old === s ? `${s} ` : s))
  const index = Math.min(count - 1, Math.max(0, whole(version, inner)))
  const goTo = (i: number) => {
    const next = Math.min(count - 1, Math.max(0, i))
    if (next === index) return
    if (version === undefined) setInner(next)
    onVersionChange?.(next)
    announce(`Versão ${fmt(next + 1)} de ${fmt(count)}`)
  }

  const copy = () => {
    try {
      if (text !== undefined) navigator.clipboard?.writeText(text).catch(() => {})
    } catch {
      /* no clipboard (insecure page / old browser) – the check still confirms the press */
    }
    onCopy?.(text)
    setCopied(Date.now())
    announce("Copied")
  }
  React.useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(0), 1600)
    return () => window.clearTimeout(t)
  }, [copied])

  const regenerate = () => {
    onRegenerate?.()
    announce("Regenerating")
  }

  const thumbsUp = () => {
    if (vote === "up") {
      setVote(null)
      onFeedback?.(null)
      return
    }
    setVote("up")
    setPanel(false)
    onFeedback?.("up")
    announce("Marked as good response")
  }
  const thumbsDown = () => {
    if (vote === "down") {
      setVote(null)
      setPanel(false)
      onFeedback?.(null)
      return
    }
    setVote("down")
    setPanel(true)
    setSent(false)
    setReason(null)
    setOther("")
    onFeedback?.("down")
    announce("Marked as bad response. Tell us what went wrong below")
  }
  const send = () => {
    if (!reason || sent) return
    onFeedback?.("down", reason === "Outro" ? other.trim() || "Outro" : reason)
    setSent(true)
    announce("Obrigado pela avaliação")
  }
  const closePanel = () => {
    setPanel(false)
    downRef.current?.focus()
  }
  React.useEffect(() => {
    if (!sent) return
    const t = window.setTimeout(() => setPanel(false), reduced() ? 1200 : 1500)
    return () => window.clearTimeout(t)
  }, [sent])

  const playing = speaking ?? innerSpeaking
  const words = text ? text.trim().split(/\s+/).length : 0
  const duration =
    typeof speakDuration === "number" && speakDuration > 0 ? speakDuration : Math.max(2600, words * 380)
  React.useEffect(() => {
    if (speaking !== undefined || !innerSpeaking) return
    const t = window.setTimeout(() => {
      setInnerSpeaking(false)
      onSpeak?.(false)
      announce("Finished reading")
    }, duration)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerSpeaking, speaking, duration])
  const speak = () => {
    const next = !playing
    if (speaking === undefined) setInnerSpeaking(next)
    onSpeak?.(next)
    announce(next ? "Lendo em voz alta" : "Leitura parada")
  }

  const active = Boolean(copied) || panel || playing || regenerating

  const Action = ({
    tip,
    labelText,
    onClick,
    pressed,
    children,
    ref,
    controls,
  }: {
    tip: string
    labelText: string
    onClick: () => void
    pressed?: boolean
    children: React.ReactNode
    ref?: React.Ref<HTMLButtonElement>
    controls?: string
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground aria-pressed:text-foreground"
          aria-label={labelText}
          aria-pressed={pressed}
          aria-expanded={controls ? panel : undefined}
          aria-controls={controls}
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tip}</TooltipContent>
    </Tooltip>
  )

  const Step = ({ dir }: { dir: "prev" | "next" }) => {
    const isPrev = dir === "prev"
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground hover:text-foreground"
        aria-label={isPrev ? "Versão anterior" : "Próxima versão"}
        disabled={isPrev ? index === 0 : index >= count - 1}
        onClick={() => goTo(isPrev ? index - 1 : index + 1)}
      >
        {isPrev ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </Button>
    )
  }

  const parts = actions.map((key) => {
    if (key === "copy")
      return (
        <Action
          key="copy"
          tip={copied ? "Copiado" : "Copiar"}
          labelText={copied ? "Copiado" : "Copiar texto"}
          onClick={copy}
        >
          {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
        </Action>
      )
    if (key === "regenerate")
      return (
        <div key="regenerate" className="flex items-center">
          <Action
            tip={regenerating ? "Escrevendo…" : "Gerar outra"}
            labelText="Gerar outra versão"
            onClick={regenerate}
          >
            <RefreshCwIcon className={cn(regenerating && "animate-spin")} />
          </Action>
          {count > 1 && (
            <span className="flex items-center" role="group" aria-label="Versões">
              <Step dir="prev" />
              <span
                className="px-0.5 text-xs text-muted-foreground tabular-nums"
                aria-label={`Versão ${fmt(index + 1)} de ${fmt(count)}`}
              >
                <span className="font-medium text-foreground">{fmt(index + 1)}</span>
                {" / "}
                {fmt(count)}
              </span>
              <Step dir="next" />
            </span>
          )}
        </div>
      )
    if (key === "feedback")
      return (
        <React.Fragment key="feedback">
          <Action tip={vote === "up" ? "Obrigado!" : "Gostei"} labelText="Gostei" pressed={vote === "up"} onClick={thumbsUp}>
            <ThumbsUpIcon className={cn(vote === "up" && "fill-current")} />
          </Action>
          <Action
            ref={downRef}
            tip="Não gostei"
            labelText="Não gostei"
            pressed={vote === "down"}
            controls={`${uid}-feedback`}
            onClick={thumbsDown}
          >
            <ThumbsDownIcon className={cn(vote === "down" && "fill-current")} />
          </Action>
        </React.Fragment>
      )
    return (
      <Action
        key="speak"
        tip={playing ? "Parar" : "Ouvir"}
        labelText={playing ? "Parar leitura" : "Ouvir em voz alta"}
        pressed={playing}
        onClick={speak}
      >
        <Volume2Icon className={cn(playing && "text-brand-text")} />
      </Action>
    )
  })

  return (
    <TooltipProvider>
      <div
        data-slot="message-actions"
        data-active={active ? "" : undefined}
        className={cn("group/ma w-full text-left", className)}
      >
        <div
          role="group"
          aria-label={label}
          className={cn(
            "flex flex-wrap items-center gap-0.5 transition-opacity",
            quiet &&
              "opacity-60 group-hover/ma:opacity-100 group-focus-within/ma:opacity-100 group-data-[active]/ma:opacity-100 [[data-ui-message]:hover_&]:opacity-100 [[data-ui-message]:focus-within_&]:opacity-100"
          )}
        >
          {parts}
        </div>

        {actions.includes("feedback") && panel && (
          <div
            id={`${uid}-feedback`}
            role="group"
            aria-labelledby={`${uid}-ask`}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation()
                closePanel()
              }
            }}
            className="mt-1.5 max-w-110 animate-in fade-in-0 slide-in-from-top-1 rounded-xl border border-border bg-card p-3.5 text-card-foreground"
          >
            <div className="flex items-center justify-between gap-2">
              <span id={`${uid}-ask`} className="text-xs font-medium">
                O que não ficou bom?
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Fechar avaliação"
                onClick={closePanel}
              >
                <XIcon />
              </Button>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {(Array.isArray(reasons) ? reasons : []).map((r, i) => (
                <Button
                  key={`${r}-${i}`}
                  type="button"
                  variant="secondary"
                  size="xs"
                  className="aria-pressed:bg-brand-soft aria-pressed:text-brand-text"
                  aria-pressed={reason === r}
                  disabled={sent}
                  onClick={() => setReason(reason === r ? null : r)}
                  title={r}
                  dir="auto"
                >
                  {r}
                </Button>
              ))}
              <Button type="button" size="xs" className="ml-auto" disabled={!reason || sent} onClick={send}>
                {sent ? (
                  <>
                    <CheckIcon />
                    Obrigado!
                  </>
                ) : (
                  "Enviar"
                )}
              </Button>
            </div>
            {Array.isArray(reasons) && reasons.includes("Outro") && reason === "Outro" && !sent && (
              <Input
                className="mt-2"
                value={other}
                placeholder="Tell us more (optional)"
                dir="auto"
                aria-label="Conte o que não ficou bom"
                onChange={(e) => setOther(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send()
                }}
              />
            )}
          </div>
        )}

        <span className="sr-only" aria-live="polite">
          {status}
        </span>
      </div>
    </TooltipProvider>
  )
}
