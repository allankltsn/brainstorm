import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { GlowCloudMood } from '@/components/affect/glow-cloud'
import { students } from './data'

/* Assistente "Aura": estado, voz e respostas de exemplo (sem servidor: tudo simulado no protótipo). */

export type AssistantAction = { label: string; to: string }
export type AssistantMessage = { id: string; from: 'user' | 'aura'; text: string; actions?: AssistantAction[] }

type Ctx = {
  open: boolean
  setOpen: (o: boolean) => void
  mood: GlowCloudMood
  busy: boolean
  listening: boolean
  mic: boolean
  setMic: (on: boolean) => void
  voiceSupported: boolean
  messages: AssistantMessage[]
  ask: (text: string) => void
  clear: () => void
}

const AssistantCtx = createContext<Ctx | null>(null)
export const useAssistant = () => {
  const c = useContext(AssistantCtx)
  if (!c) throw new Error('useAssistant fora do AssistantProvider')
  return c
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

/* Respostas de exemplo. Em produção isto vira a chamada ao agente. */
function reply(q: string): Omit<AssistantMessage, 'id' | 'from'> {
  const t = norm(q)
  const named = students.find((s) => t.includes(norm(s.name.split(' ')[0])))
  if (/(atencao|parad|sem treinar|faltando|sumid)/.test(t)) {
    const late = students.filter((s) => s.status === 'ativo' && (s.lastSessionDays ?? 0) >= 7)
    return {
      text: `${late.length} alunos estão há 7 dias ou mais sem treinar: ${late.map((s) => `${s.name.split(' ')[0]} (${s.lastSessionDays} dias)`).join(', ')}. Quer que eu abra a lista?`,
      actions: [{ label: 'Abrir alunos', to: '/alunos' }],
    }
  }
  if (/(convid|novo aluno|adicionar aluno)/.test(t)) return { text: 'Posso preparar o convite. Abra a lista de alunos e toque em Convidar aluno; eu deixo o e-mail pronto para você revisar.', actions: [{ label: 'Abrir alunos', to: '/alunos' }] }
  if (/(sugerir|sugest|montar|criar|novo).*(treino)|treino.*(para|pro|pra)/.test(t))
    return {
      text: named
        ? `Vou preparar um rascunho de treino para ${named.name}. Você revisa antes de qualquer coisa ir para o aluno.`
        : 'Vamos montar um treino. Escolha o aluno e o objetivo, e eu preparo um rascunho para você revisar.',
      actions: [{ label: 'Abrir sugestão de treino', to: '/ia' }],
    }
  if (named)
    return {
      text: `${named.name}: ${named.plan ?? 'sem treino no momento'}, última sessão ${named.lastSession.toLowerCase()}${named.alerts ? ', com 1 alerta aberto' : ', sem alertas'}.`,
      actions: [{ label: `Abrir ${named.name.split(' ')[0]}`, to: `/alunos/${named.id}` }],
    }
  if (/(alerta|acompanh|questionario|treinos feitos)/.test(t)) return { text: 'Você tem 2 alertas abertos: Marina Lopes e Felipe Almeida, os dois por faltas seguidas.', actions: [{ label: 'Abrir acompanhamento', to: '/acompanhamento' }] }
  if (/(agenda|hoje|horario|atendimento)/.test(t)) return { text: 'Hoje você tem 4 atendimentos: Lucas às 07:00, Gabriela às 09:30, Bruno às 12:00 e Juliana às 18:30.', actions: [{ label: 'Ver o início', to: '/inicio' }] }
  if (/(mensag|conversa)/.test(t)) return { text: 'Abri o caminho para as mensagens. Marina respondeu há 20 minutos.', actions: [{ label: 'Abrir mensagens', to: '/mensagens' }] }
  if (/(assinatura|plano|pagamento|cobranca)/.test(t)) return { text: 'Seu plano é o Pro, com 18 de 30 vagas em uso. A próxima cobrança é em 03/11, de R$ 49,90.', actions: [{ label: 'Ver assinatura', to: '/configuracoes?aba=assinatura' }] }
  if (/(oi|ola|bom dia|boa tarde|boa noite)\b/.test(t)) return { text: 'Olá! Posso mostrar quem precisa de atenção, montar um treino ou abrir qualquer tela para você.' }
  return {
    text: 'Ainda estou aprendendo essa. Por enquanto consigo: dizer quem está sem treinar, resumir um aluno pelo nome, montar um rascunho de treino e abrir as telas para você.',
  }
}

type Recognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onend: (() => void) | null
  onerror: ((e: { error: string }) => void) | null
  onstart: (() => void) | null
}

function recognitionCtor(): (new () => Recognition) | null {
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as (new () => Recognition) | null
}

const SLEEP_AFTER = 40_000

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [busy, setBusy] = useState(false)
  const [happy, setHappy] = useState(false)
  const [asleep, setAsleep] = useState(false)
  // Microfone sempre começa desligado; só liga por decisão do usuário.
  const [mic, setMicState] = useState(false)
  const [listening, setListening] = useState(false)
  const voiceSupported = typeof window !== 'undefined' && !!recognitionCtor()
  const rec = useRef<Recognition | null>(null)
  const micRef = useRef(false)
  const seq = useRef(0)

  const speak = useCallback((text: string) => {
    if (!micRef.current || !('speechSynthesis' in window)) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'pt-BR'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }, [])

  const ask = useCallback(
    (text: string) => {
      const q = text.trim()
      if (!q) return
      setMessages((m) => [...m, { id: `m${++seq.current}`, from: 'user', text: q }])
      setBusy(true)
      setAsleep(false)
      window.setTimeout(() => {
        const r = reply(q)
        setMessages((m) => [...m, { id: `m${++seq.current}`, from: 'aura', ...r }])
        setBusy(false)
        setHappy(true)
        window.setTimeout(() => setHappy(false), 1800)
        speak(r.text)
      }, 1900)
    },
    [speak],
  )

  const stopRec = useCallback(() => {
    const r = rec.current
    rec.current = null
    if (r) {
      r.onend = null
      r.stop()
    }
    setListening(false)
  }, [])

  const setMic = useCallback(
    (on: boolean) => {
      if (!on) {
        micRef.current = false
        setMicState(false)
        stopRec()
        if ('speechSynthesis' in window) window.speechSynthesis.cancel()
        return
      }
      const Ctor = recognitionCtor()
      if (!Ctor) {
        toast('Este navegador não tem conversa por voz', { description: 'Você pode continuar escrevendo normalmente.' })
        return
      }
      const r = new Ctor()
      r.lang = 'pt-BR'
      r.continuous = true
      r.interimResults = false
      r.onstart = () => setListening(true)
      r.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) ask(e.results[i][0].transcript)
      }
      r.onerror = (e) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          toast.error('Microfone bloqueado', { description: 'Libere o microfone nas permissões do navegador para conversar por voz.' })
          micRef.current = false
          setMicState(false)
        }
      }
      // O navegador encerra sozinho depois de um silêncio: religa enquanto o usuário não desligar
      r.onend = () => {
        setListening(false)
        if (micRef.current && rec.current === r) {
          try {
            r.start()
          } catch {
            /* já iniciando */
          }
        }
      }
      rec.current = r
      micRef.current = true
      setMicState(true)
      try {
        r.start()
      } catch {
        /* já iniciando */
      }
    },
    [ask, stopRec],
  )

  useEffect(() => () => stopRec(), [stopRec])

  // Sem uso por um tempo: a nuvem fica sonolenta; qualquer movimento acorda
  useEffect(() => {
    let timer = window.setTimeout(() => setAsleep(true), SLEEP_AFTER)
    const wake = () => {
      setAsleep(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setAsleep(true), SLEEP_AFTER)
    }
    const events = ['pointermove', 'pointerdown', 'keydown', 'scroll'] as const
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }))
    return () => {
      window.clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, wake))
    }
  }, [])

  const mood: GlowCloudMood = busy ? 'thinking' : happy ? 'happy' : listening ? 'listening' : asleep && !open ? 'sleepy' : 'idle'

  const value: Ctx = {
    open,
    setOpen: (o) => {
      setOpen(o)
      if (!o) setMic(false)
    },
    mood,
    busy,
    listening,
    mic,
    setMic,
    voiceSupported,
    messages,
    ask,
    clear: () => setMessages([]),
  }
  return <AssistantCtx.Provider value={value}>{children}</AssistantCtx.Provider>
}
