import { ArrowRight } from "lucide-react"
import { motion, useMotionValueEvent, useSpring } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { BlurFade } from "@/components/magicui/blur-fade"
import { BorderBeam } from "@/components/magicui/border-beam"
import { Btn, Container, SectionHead } from "@/components/ui"
import { cn } from "@/lib/utils"

/* Premissas ilustrativas (mesmas do protótipo anterior). */
const SEMANAS_MES = 4.33
const MODOS = {
  cons: { nome: "conservador", red: 0.2, rec: 0.25, desc: "20% do tempo e 25% da inadimplência" },
  pad: { nome: "padrão", red: 0.35, rec: 0.4, desc: "35% do tempo e 40% da inadimplência" },
} as const
type Modo = keyof typeof MODOS

function planoPara(alunos: number) {
  if (alunos <= 5) return { nome: "Starter", preco: 0 }
  if (alunos <= 30) return { nome: "Pro", preco: 49.9 }
  return { nome: "Premium", preco: 99.9 }
}

export function calcular(alunos: number, ticket: number, horas: number, inad: number, valorHora: number, modo: Modo) {
  const m = MODOS[modo]
  const receita = alunos * ticket
  const perdaInad = receita * (inad / 100)
  const recuperado = perdaInad * m.rec
  const horasMes = horas * SEMANAS_MES
  const horasEcon = horasMes * m.red
  const valorTempo = horasEcon * valorHora
  const plano = planoPara(alunos)
  const ganhoBruto = recuperado + valorTempo
  const ganhoLiquido = ganhoBruto - plano.preco
  const roi = plano.preco > 0 ? ganhoLiquido / plano.preco : null
  const paybackDias = plano.preco > 0 && ganhoBruto > 0 ? (plano.preco / ganhoBruto) * 30 : 0
  return {
    perdaInad, recuperado, horasMes, horasEcon, valorTempo, plano, ganhoLiquido, roi, paybackDias,
    custoPlanilha: horasMes * valorHora + perdaInad,
    custoAura: (horasMes - horasEcon) * valorHora + (perdaInad - recuperado) + plano.preco,
  }
}

const brl = (v: number, d = 0) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: d, maximumFractionDigits: d })
const num = (v: number, d = 1) => v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d })

/** Número que desliza até o novo valor (mola). */
function Flow({ value, format }: { value: number; format: (v: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const spring = useSpring(value, { stiffness: 90, damping: 20 })
  useEffect(() => { spring.set(value) }, [value, spring])
  useMotionValueEvent(spring, "change", (v) => { if (ref.current) ref.current.textContent = format(v) })
  return <span ref={ref} className="tabular-nums">{format(value)}</span>
}

type Campo = { k: "alunos" | "ticket" | "horas" | "inad" | "vh"; label: string; min: number; max: number; step: number; fmt: (v: number) => string; hint?: string }
const campos: Campo[] = [
  { k: "alunos", label: "Alunos ativos", min: 1, max: 200, step: 1, fmt: (v) => `${v}` },
  { k: "ticket", label: "Ticket médio mensal por aluno", min: 50, max: 2000, step: 10, fmt: (v) => brl(v) },
  { k: "horas", label: "Horas por semana em tarefas manuais", min: 1, max: 40, step: 1, fmt: (v) => `${v} h`, hint: "Some montagem de ficha, ajustes, mensagens de lembrete, conferência de pagamento e planilha." },
  { k: "inad", label: "Inadimplência mensal", min: 0, max: 40, step: 1, fmt: (v) => `${v}%` },
  { k: "vh", label: "Quanto vale 1 hora do seu tempo", min: 10, max: 500, step: 5, fmt: (v) => brl(v) },
]

const cenarios = [
  { t: "Personal autônomo", v: { alunos: 12, ticket: 300, horas: 8, inad: 10, vh: 70 }, d: "Dor: montar ficha rápido entre atendimentos." },
  { t: "Estúdio pequeno", v: { alunos: 60, ticket: 220, horas: 20, inad: 15, vh: 50 }, d: "Dor: alinhar 2 profissionais e cobrar todo mês." },
  { t: "Consultoria online", v: { alunos: 35, ticket: 180, horas: 12, inad: 8, vh: 60 }, d: "Dor: acompanhar à distância sem perder o aluno." },
]

export function Roi() {
  const [v, setV] = useState({ alunos: 20, ticket: 250, horas: 10, inad: 12, vh: 60 })
  const [modo, setModo] = useState<Modo>("cons")
  const r = calcular(v.alunos, v.ticket, v.horas, v.inad, v.vh, modo)
  const max = Math.max(r.custoPlanilha, r.custoAura, 1)
  const pb = r.paybackDias < 1 ? "menos de 1 dia" : `menos de ${Math.ceil(r.paybackDias)} dias`

  return (
    <section id="roi" aria-labelledby="h-roi" className="relative py-20 md:py-28">
      <Container>
        <SectionHead
          id="h-roi"
          eyebrow="Calculadora"
          title={<>Quanto a planilha <span className="text-grad">custa por mês?</span></>}
          lead="Informe sua rotina. A simulação estima o tempo e o dinheiro que você pode recuperar. É uma estimativa, não uma garantia."
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_1.05fr]">
          <BlurFade inView>
            <fieldset className="rounded-3xl border border-line bg-surface p-6 md:p-8">
              <legend className="sr-only">Sua rotina</legend>
              <div role="radiogroup" aria-label="Premissas da estimativa" className="relative mb-8 grid grid-cols-2 rounded-2xl bg-bg p-1">
                {(Object.keys(MODOS) as Modo[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={modo === m}
                    onClick={() => setModo(m)}
                    className={cn("relative z-10 rounded-xl px-3 py-2.5 text-left transition-colors", modo === m ? "text-white" : "text-muted hover:text-ink")}
                  >
                    {modo === m && <motion.span layoutId="modo-pill" className="absolute inset-0 -z-10 rounded-xl bg-primary" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                    <span className="block text-sm font-semibold capitalize">{MODOS[m].nome}</span>
                    <span className={cn("block text-[11px] leading-snug", modo === m ? "text-white/80" : "text-faint")}>{MODOS[m].desc}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {campos.map((c) => (
                  <div key={c.k}>
                    <div className="flex items-baseline justify-between gap-4">
                      <label htmlFor={`r-${c.k}`} className="text-sm font-medium text-muted">{c.label}</label>
                      <output htmlFor={`r-${c.k}`} className="text-lg font-bold tabular-nums text-ink">{c.fmt(v[c.k])}</output>
                    </div>
                    <input
                      id={`r-${c.k}`}
                      type="range"
                      className="aura-range mt-1"
                      min={c.min}
                      max={c.max}
                      step={c.step}
                      value={v[c.k]}
                      style={{ "--p": `${((v[c.k] - c.min) / (c.max - c.min)) * 100}%` } as React.CSSProperties}
                      onChange={(e) => setV((s) => ({ ...s, [c.k]: Number(e.target.value) }))}
                    />
                    {c.hint && <p className="mt-1 text-xs leading-relaxed text-faint">{c.hint}</p>}
                  </div>
                ))}
              </div>
            </fieldset>
          </BlurFade>

          <BlurFade inView delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-primary-line bg-gradient-to-b from-primary-soft/70 to-surface p-6 md:p-8 lg:sticky lg:top-32">
              <BorderBeam size={180} duration={9} colorFrom="#ff6f78" colorTo="#b1111b" />
              <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/30 blur-[90px]" />
              <div className="relative">
                <p className="text-sm text-muted">Ganho líquido estimado por mês · cenário <strong className="text-ink">{MODOS[modo].nome}</strong></p>
                <p className="display mt-3 text-[clamp(48px,7vw,88px)] text-ink">
                  <Flow value={r.ganhoLiquido} format={(x) => brl(Math.round(x))} />
                </p>
                <p className="mt-2 text-sm text-faint">Tempo equivalente mais dinheiro recuperado, menos o custo do plano.</p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-bg/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-faint">Tempo liberado</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight"><Flow value={r.horasEcon} format={(x) => `${num(x)} h`} /></p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">Equivale a <Flow value={r.valorTempo} format={(x) => brl(Math.round(x))} /> em custo de oportunidade. Não é dinheiro no bolso: é tempo para mais alunos ou descanso.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-bg/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-faint">Dinheiro recuperado</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight"><Flow value={r.recuperado} format={(x) => brl(Math.round(x))} /></p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">Inadimplência recuperada com lembretes e link de pagamento.</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3" aria-hidden="true">
                  {[
                    { l: "Planilha e WhatsApp", val: r.custoPlanilha, c: "bg-line-strong" },
                    { l: `aura-fit (${r.plano.nome})`, val: r.custoAura, c: "bg-gradient-to-r from-brand to-accent" },
                  ].map((b) => (
                    <div key={b.l}>
                      <div className="mb-1 flex justify-between text-xs text-muted"><span>{b.l}</span><span className="tabular-nums">{brl(Math.round(b.val))}/mês</span></div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-bg/70">
                        <motion.div className={cn("h-full rounded-full", b.c)} animate={{ width: `${(b.val / max) * 100}%` }} transition={{ type: "spring", stiffness: 90, damping: 20 }} />
                      </div>
                    </div>
                  ))}
                  <p className="text-[11px] text-faint">Custo mensal escondido estimado: tempo manual × valor da hora + inadimplência + assinatura.</p>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-muted">
                  Plano indicado: <strong className="text-ink">{r.plano.nome}</strong>, {r.plano.preco ? brl(r.plano.preco, 2) : "grátis"} por mês.{" "}
                  {r.roi !== null
                    ? <>Retorno de cerca de <strong className="text-ink">{num(r.roi)}×</strong> o valor do plano; ele se pagaria em {pb}.</>
                    : <>Plano gratuito: sem custo mensal, sem retorno a calcular.</>}
                </p>
                <p role="status" aria-live="polite" className="sr-only">
                  Com {v.alunos} alunos, no cenário {MODOS[modo].nome}: ganho líquido estimado de {brl(Math.round(r.ganhoLiquido))} por mês.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Btn href="https://aura.teotonio.xyz/login">Começar grátis <ArrowRight size={18} /></Btn>
                  <Btn href="#planos" variant="ghost">Ver os planos</Btn>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-faint">
          Estimativa baseada em premissas (cenário {MODOS[modo].nome}: redução de {MODOS[modo].red * 100}% do tempo manual e recuperação de {MODOS[modo].rec * 100}% da inadimplência). Seus resultados dependem da sua rotina e podem ser menores ou nulos. O retorno é uma estimativa, não uma garantia.
        </p>

        <div className="mt-12">
          <h3 className="text-xl font-bold tracking-tight">Ou comece por um cenário</h3>
          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            {cenarios.map((c, i) => {
              const cr = calcular(c.v.alunos, c.v.ticket, c.v.horas, c.v.inad, c.v.vh, modo)
              const on = JSON.stringify(c.v) === JSON.stringify(v)
              return (
                <li key={c.t}>
                  <BlurFade inView delay={i * 0.08} className="h-full">
                    <motion.button
                      type="button"
                      aria-pressed={on}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setV(c.v); document.getElementById("roi")?.scrollIntoView({ block: "start", behavior: "smooth" }) }}
                      className={cn("flex h-full w-full flex-col rounded-3xl border p-6 text-left transition-colors", on ? "border-primary bg-primary-soft/50" : "border-line bg-surface hover:border-line-strong")}
                    >
                      <span className="text-[11px] text-faint">Exemplo de perfil</span>
                      <span className="mt-3 text-lg font-bold tracking-tight">{c.t}</span>
                      <span className="mt-1 text-sm text-muted">{c.v.alunos} alunos, {brl(c.v.ticket)}, {c.v.horas} h por semana, {c.v.inad}% de inadimplência.</span>
                      <span className="mt-3 text-sm text-muted">Cerca de <b className="text-ink">{num(cr.horasEcon)} h</b> liberadas e ganho líquido de cerca de <b className="text-ink">{brl(Math.round(cr.ganhoLiquido))}</b> por mês. Não é garantia.</span>
                      <span className="mt-3 text-[13px] text-faint">{c.d}</span>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">Simular este cenário <ArrowRight size={16} /></span>
                    </motion.button>
                  </BlurFade>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}
