import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { GlowCloudMood } from '@/components/affect/glow-cloud'
import { leadSources } from './data'

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
  if (/(precisa de mim|pendent|aprovar|aprovac|fila|hoje)/.test(t))
    return {
      text: 'Os rascunhos de posts e a resposta sugerida no WhatsApp esperam a sua revisão. Nada é publicado ou enviado sem a sua aprovação.',
      actions: [{ label: 'Abrir a fila de aprovação', to: '/conteudo?aba=fila' }],
    }
  if (/(lead|origem|captac|de onde)/.test(t)) {
    const total = leadSources.reduce((n, s) => n + s.leads, 0)
    return { text: `Foram ${total} leads nos últimos 7 dias. A maior origem é ${leadSources[0].source}, com ${leadSources[0].leads}.`, actions: [{ label: 'Abrir clientes', to: '/clientes' }] }
  }
  if (/(post|carrossel|conteudo|legenda|imagem)/.test(t)) return { text: 'Vou preparar um rascunho usando o seu brand kit. Ele entra na fila de aprovação e só é publicado depois que você aprovar.', actions: [{ label: 'Criar rascunho', to: '/conteudo' }] }
  if (/(marca|brand|logo|paleta|cor|fonte|tipografia|tom de voz|briefing)/.test(t)) return { text: 'O brand kit reúne logo, paleta, tipografia e tom de voz. Responda o briefing e eu sugiro tudo para você revisar.', actions: [{ label: 'Abrir a marca', to: '/marca' }] }
  if (/(mensag|conversa|whatsapp|instagram|e-?mail)/.test(t)) return { text: 'Há 1 conversa nova no WhatsApp. Deixei uma resposta sugerida para você revisar.', actions: [{ label: 'Abrir conversas', to: '/conversas' }] }
  if (/(assinatura|plano|pagamento|cobranca|credito)/.test(t)) return { text: 'Seu plano é o Pro. Você usou 340 de 1.000 créditos de IA neste mês e a próxima cobrança é em 03/12.', actions: [{ label: 'Ver assinatura', to: '/configuracoes?aba=assinatura' }] }
  if (/(oi|ola|bom dia|boa tarde|boa noite)\b/.test(t)) return { text: 'Olá! Posso mostrar o que precisa da sua aprovação, preparar um post ou abrir qualquer tela para você.' }
  return {
    text: 'Ainda estou aprendendo essa. Por enquanto consigo: mostrar o que espera sua aprovação, resumir seus leads, preparar rascunhos de conteúdo e abrir as telas para você.',
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
