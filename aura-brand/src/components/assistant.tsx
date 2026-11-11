import { MicOff, RotateCcw, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/affect/button'
import { Cloud } from '@/components/affect/glow-cloud'
import { ThinkingLoader } from '@/components/affect/thinking-loader'
import { AiPrompt } from '@/components/lightswind/ai-prompt'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAssistant } from '@/lib/assistant'
import { firstName, session } from '@/lib/data'
import { cn } from '@/lib/utils'

const SUGGESTIONS = ['O que precisa de mim hoje?', 'Criar um post sobre a novidade', 'De onde vêm meus leads?']

const STATUS = { thinking: 'Trabalhando nisso…', listening: 'Ouvindo você…', happy: 'Pronto!', sleepy: 'Descansando', idle: 'Pronta para ajudar' } as const

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function Panel() {
  const a = useAssistant()
  const navigate = useNavigate()
  const [draft, setDraft] = useState('')
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' })
  }, [a.messages.length, a.busy])
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && a.setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  })

  return (
    <section
      role="dialog"
      aria-label="Assistente Aura"
      className="fixed inset-x-2 top-16 bottom-2 z-40 flex flex-col overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-2xl sm:inset-auto sm:right-5 sm:bottom-5 sm:h-[min(38rem,calc(100svh-6rem))] sm:w-[25rem]"
    >
      <header className="flex items-center gap-2 border-b py-2 pr-2 pl-2">
        <Cloud mood={a.mood} followWindow className="size-12 shrink-0" label="Aura, a assistente" />
        <div className="min-w-0 flex-1 leading-tight">
          <h2 className="text-sm font-semibold">Aura</h2>
          <p className="truncate text-xs text-muted-foreground" role="status">
            {STATUS[a.mood]}
          </p>
        </div>
        {a.messages.length > 0 && (
          <IconButton label="Começar nova conversa" onClick={a.clear}>
            <RotateCcw />
          </IconButton>
        )}
        <IconButton label="Fechar assistente" onClick={() => a.setOpen(false)}>
          <X />
        </IconButton>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
        {a.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Cloud mood={a.mood} followWindow className="size-28" label="" />
            <p className="mt-1 text-base font-semibold">Olá, {firstName(session.name)}. Como posso ajudar?</p>
            <p className="mt-1 max-w-64 text-sm text-muted-foreground">Fale ou escreva. Eu preparo rascunhos, resumo seus leads e abro as telas para você.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => a.ask(s)}
                  className="rounded-full border bg-card px-3 py-1.5 text-sm outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ol className="grid gap-3">
            {a.messages.map((m) => (
              <li key={m.id} className={cn('flex', m.from === 'user' && 'justify-end')}>
                <div className={cn('max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed', m.from === 'user' ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-muted')}>
                  <p>{m.text}</p>
                  {m.actions && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {m.actions.map((act) => (
                        <Button
                          key={act.to}
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            navigate(act.to)
                            if (window.innerWidth < 640) a.setOpen(false)
                          }}
                        >
                          {act.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
            {a.busy && (
              <li>
                <ThinkingLoader size="sm" phases={['Entendendo o pedido', 'Consultando sua marca', 'Preparando a resposta']} interval={650} />
              </li>
            )}
          </ol>
        )}
        <div ref={end} />
      </div>

      <footer className="px-3 pb-3">
        <AiPrompt
          value={draft}
          onChange={setDraft}
          onSubmit={(t) => {
            a.ask(t)
            setDraft('')
          }}
          placeholder="Pergunte ou peça algo"
          mic={a.mic}
          onMicChange={a.setMic}
          micLabel={a.listening ? 'Ouvindo' : 'Microfone ligado'}
          disabled={a.busy}
        />
        <p className="mt-1.5 px-2 text-center text-[11px] text-muted-foreground">
          {a.mic ? 'Com o microfone ligado, a Aura ouve e responde em voz alta.' : 'O microfone fica desligado até você ligar.'}
        </p>
      </footer>
    </section>
  )
}

/* Botão flutuante: a nuvem acompanha o ponteiro, cochila sem uso e mostra quando está trabalhando. */
export function AssistantWidget() {
  const a = useAssistant()
  if (a.open) return <Panel />
  return (
    <div className="fixed right-3 bottom-[4.75rem] z-40 md:right-5 md:bottom-5">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => a.setOpen(true)}
            aria-label="Abrir a assistente Aura"
            className="group relative flex size-[4.5rem] items-center justify-center rounded-full outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
          >
            <Cloud mood={a.mood} followWindow className="size-[5.5rem] shrink-0" label="" />
            {a.busy && <span className="absolute top-1 right-1 size-3 animate-ping rounded-full bg-primary" aria-hidden="true" />}
            <span className="absolute right-0 bottom-1 flex size-6 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm" aria-hidden="true">
              <MicOff className="size-3" />
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">Falar com a Aura</TooltipContent>
      </Tooltip>
    </div>
  )
}
