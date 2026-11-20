"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  SendIcon,
  XIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export type ThreadAuthor = {
  name: string
  avatar?: React.ReactNode | string
  assistant?: boolean
}

export type ThreadMessage = {
  id: string
  author: ThreadAuthor
  createdAt: Date | number
  text: string
  /** Assistant replies: a short status line that folds open to show these details */
  status?: string
  details?: string[]
}

export type CommentThreadProps = {
  title?: string
  messages: ThreadMessage[]
  currentUser: ThreadAuthor
  /** The assistant that answers – used for the thinking state */
  assistant?: ThreadAuthor
  /**
   * Called with every new reply. Return a message (or a promise of one) to let the assistant answer;
   * return nothing to just post the reply.
   */
  onReply?: (
    text: string
  ) => ThreadMessage | Promise<ThreadMessage | void> | void
  onClose?: () => void
  className?: string
}

function ago(time: number, now: number) {
  const s = Math.max(0, Math.round((now - time) / 1000))
  if (s < 45) return "just now"
  const m = Math.round(s / 60)
  if (m < 60) return `${m}min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  if (d < 30) return `${d}d ago`
  return d < 365 ? `${Math.round(d / 30)}mo ago` : `${Math.round(d / 365)}y ago`
}

// 1284 → "1,284"
const count = new Intl.NumberFormat("en")

/** Two initials from whole letters – skips emoji and stray spaces, so "🦊 Fox" gives "F" */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => Array.from(w).find((c) => /[\p{L}\p{N}]/u.test(c)))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

export function CommentThread({
  title = "Comentário",
  messages: initial,
  currentUser,
  assistant,
  onReply,
  onClose,
  className,
}: CommentThreadProps) {
  const [messages, setMessages] = React.useState(initial)
  const [open, setOpen] = React.useState<Set<string>>(new Set())
  const [draft, setDraft] = React.useState("")
  const [thinking, setThinking] = React.useState(false)
  const [now, setNow] = React.useState(() => Date.now())
  const listRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(t)
  }, [])

  // Follow the conversation as it grows
  React.useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages.length, thinking])

  const send = async () => {
    const text = draft.trim()
    if (!text || thinking) return
    setDraft("")
    setNow(Date.now())
    setMessages((m) => [
      ...m,
      { id: `m-${Date.now()}`, author: currentUser, createdAt: Date.now(), text },
    ])
    const answer = onReply?.(text)
    if (!answer) return
    setThinking(true)
    try {
      const reply = await answer
      if (reply) setMessages((m) => [...m, { ...reply, createdAt: Date.now() }])
    } finally {
      setThinking(false)
      setNow(Date.now())
    }
  }

  const toggle = (id: string) => {
    setOpen((o) => {
      const next = new Set(o)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section
      data-slot="comment-thread"
      aria-label={title}
      className={cn(
        "flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-muted/40",
        className
      )}
    >
      <header className="flex min-h-11 items-center gap-2.5 px-4 py-2">
        <h3
          dir="auto"
          title={title}
          className="min-w-0 flex-1 truncate text-sm font-medium text-foreground"
        >
          {title}
        </h3>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {count.format(messages.length)}{" "}
          {messages.length === 1 ? "message" : "messages"}
        </span>
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Fechar comentário"
            onClick={onClose}
          >
            <XIcon />
          </Button>
        )}
      </header>

      <div className="mx-2 rounded-lg border border-border bg-card shadow-sm">
        <div
          ref={listRef}
          aria-live="polite"
          className="grid max-h-[340px] content-start gap-4 overflow-y-auto p-4"
        >
          {messages.map((m) => {
            const isOpen = open.has(m.id)
            const command = /^\/edit\b/i.test(m.text.trim())
            const isAssistant = m.author.assistant
            return (
              <article key={m.id} className="min-w-0">
                <div className="flex items-center gap-2">
                  <MessageAvatar author={m.author} />
                  <span
                    dir="auto"
                    title={m.author.name}
                    className="min-w-0 truncate text-sm font-medium text-foreground"
                  >
                    {m.author.name}
                  </span>
                  <time
                    dateTime={new Date(m.createdAt).toISOString()}
                    className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums"
                  >
                    {ago(+m.createdAt, now)}
                  </time>
                </div>
                {m.text && (
                  <p
                    dir="auto"
                    className={cn(
                      "mt-2 rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-line [overflow-wrap:anywhere]",
                      isAssistant
                        ? "bg-brand-soft text-brand-text"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {command ? (
                      <>
                        <span className="text-muted-foreground">/Edit</span>{" "}
                        {m.text.trim().replace(/^\/edit\s*/i, "")}
                      </>
                    ) : (
                      m.text
                    )}
                  </p>
                )}
                {m.status && (
                  <div className="mt-2">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      disabled={!m.details?.length}
                      onClick={() => toggle(m.id)}
                      className="group inline-flex max-w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-default disabled:hover:bg-transparent"
                    >
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-text">
                        <CheckIcon className="size-3" />
                      </span>
                      <span
                        dir="auto"
                        title={m.status}
                        className="min-w-0 truncate text-muted-foreground"
                      >
                        {m.status}
                      </span>
                      {!!m.details?.length && (
                        <ChevronDownIcon className="size-3.5 shrink-0 text-muted-foreground transition-transform group-aria-expanded:rotate-180" />
                      )}
                    </button>
                    {!!m.details?.length && isOpen && (
                      <ul className="mt-1.5 flex flex-col gap-1.5 border-l border-border pl-4">
                        {m.details.map((d, i) => (
                          <li
                            key={i}
                            dir="auto"
                            className="text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere]"
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </article>
            )
          })}
          {thinking && assistant && (
            <article aria-label={`${assistant.name} is thinking`} className="min-w-0">
              <div className="flex items-center gap-2">
                <MessageAvatar author={assistant} />
                <span className="truncate text-sm font-medium text-foreground">
                  {assistant.name}
                </span>
              </div>
              <p className="mt-2 animate-pulse text-sm text-muted-foreground">
                Pensando…
              </p>
            </article>
          )}
        </div>
      </div>

      <form
        className="flex items-end gap-2 p-2"
        onSubmit={(e) => {
          e.preventDefault()
          void send()
        }}
      >
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={
            assistant ? `Reply, or ask @${assistant.name}…` : "Add comment…"
          }
          aria-label="Responder"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              void send()
            }
          }}
          className="min-h-9 flex-1 resize-none border-transparent bg-transparent"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Enviar resposta"
          disabled={!draft.trim() || thinking}
        >
          <SendIcon />
        </Button>
      </form>
    </section>
  )
}

function MessageAvatar({ author }: { author: ThreadAuthor }) {
  if (author.assistant && !author.avatar) {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center">
        <AssistantMark />
      </span>
    )
  }
  const node =
    author.avatar && typeof author.avatar !== "string" ? author.avatar : null
  const src = typeof author.avatar === "string" ? author.avatar : undefined

  return (
    <Avatar size="sm" className="shrink-0">
      {node ? (
        <AvatarFallback className="bg-brand-soft text-brand-text [&>svg]:size-4">
          {node}
        </AvatarFallback>
      ) : (
        <>
          {src ? <AvatarImage src={src} alt="" /> : null}
          <AvatarFallback
            className={cn(
              author.assistant && "bg-brand-soft text-brand-text"
            )}
          >
            {initials(author.name)}
          </AvatarFallback>
        </>
      )}
    </Avatar>
  )
}

/** A simple assistant mark: a brand-tinted circle with a sparkle – pass your own logo as `avatar` instead */
export function AssistantMark({ className }: { className?: string }) {
  return (
    <span
      data-slot="assistant-mark"
      aria-hidden="true"
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-text",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-3.5"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2.5l1.9 5.1a4 4 0 0 0 2.5 2.5L21.5 12l-5.1 1.9a4 4 0 0 0-2.5 2.5L12 21.5l-1.9-5.1a4 4 0 0 0-2.5-2.5L2.5 12l5.1-1.9a4 4 0 0 0 2.5-2.5L12 2.5z" />
      </svg>
    </span>
  )
}
