import { Keyboard, Mic, MicOff, RotateCcw, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/affect/button'
import { Cloud } from '@/components/affect/glow-cloud'
import { ThinkingLoader } from '@/components/affect/thinking-loader'
import { AiPrompt } from '@/components/lightswind/ai-prompt'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAssistant } from '@/lib/assistant'
import { firstName, sessions } from '@/lib/data'
import { useRole } from '@/lib/role'
import { cn } from '@/lib/utils'

const SUGGESTIONS = ['Quem precisa de atenção?', 'Montar treino para a Marina', 'Como está a agenda de hoje?']

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
  const { role } = useRole()
  const navigate = useNavigate()
  const [draft, setDraft] = useState('')
  // Voz é o modo padrão. Sem suporte no navegador, abre direto em texto.
  const [mode, setMode] = useState<'voz' | 'texto'>(a.voiceSupported ? 'voz' : 'texto')
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
            <p className="mt-1 text-base font-semibold">Olá, {firstName(sessions[role].name)}. Como posso ajudar?</p>
            <p className="mt-1 max-w-64 text-sm text-muted-foreground">{mode === 'voz' ? 'Ligue o microfone e fale.' : 'Escreva o que precisa.'} Eu encontro alunos, monto treinos e abro as telas para você.</p>
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
                <ThinkingLoader size="sm" phases={['Entendendo o pedido', 'Consultando seus alunos', 'Preparando a resposta']} interval={650} />
              </li>
            )}
          </ol>
        )}
        <div ref={end} />
      </div>

      {mode === 'voz' ? (
        <footer className="flex flex-col items-center gap-2 border-t px-3 pt-4 pb-3">
          <span className="relative flex">
            {a.mic && <span className="absolute inset-0 animate-ping rounded-full bg-primary/30 motion-reduce:hidden" aria-hidden="true" />}
            <button
              type="button"
              aria-pressed={a.mic}
              aria-label={a.mic ? 'Desligar microfone' : 'Ligar microfone'}
              onClick={() => a.setMic(!a.mic)}
              className={cn(
                'relative flex size-16 items-center justify-center rounded-full border-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:size-6',
                a.mic ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground',
              )}
            >
              {a.mic ? <Mic /> : <MicOff />}
            </button>
          </span>
          <p className="text-sm font-medium" role="status">
            {a.mic ? (a.busy ? 'Trabalhando nisso…' : a.listening ? 'Pode falar, estou ouvindo' : 'Microfone ligado') : 'Toque para ligar o microfone'}
          </p>
          <p className="max-w-72 text-center text-[11px] text-muted-foreground">{a.mic ? 'A Aura ouve e responde em voz alta. Toque de novo para desligar.' : 'O microfone fica desligado até você ligar.'}</p>
          <Button
            size="sm"
            variant="ghost"
            icon={<Keyboard />}
            onClick={() => {
              a.setMic(false)
              setMode('texto')
            }}
          >
            Prefiro escrever
          </Button>
        </footer>
      ) : (
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
          <div className="mt-1.5 flex items-center justify-center gap-2 px-2 text-[11px] text-muted-foreground">
            {a.voiceSupported ? (
              <button type="button" onClick={() => setMode('voz')} className="inline-flex items-center gap-1 font-medium underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring">
                <Mic className="size-3" /> Voltar para a conversa por voz
              </button>
            ) : (
              <span>Este navegador não tem conversa por voz, então a Aura atende por texto.</span>
            )}
          </div>
        </footer>
      )}
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
