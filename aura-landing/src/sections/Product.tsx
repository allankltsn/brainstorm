import { AlertTriangle, ArrowRight, BellRing, Check, Clock, CreditCard, Link2, Send, Sparkles, TrendingDown, UserPlus, Activity } from "lucide-react"
import { AnimatePresence, motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { AnimatedList } from "@/components/magicui/animated-list"
import { BlurFade } from "@/components/magicui/blur-fade"
import { BorderBeam } from "@/components/magicui/border-beam"
import { DotPattern } from "@/components/magicui/dot-pattern"
import { MagicCard } from "@/components/magicui/magic-card"
import { Btn, Container, Eyebrow, Mock, Phone, SectionHead } from "@/components/ui"
import { cn } from "@/lib/utils"

/* ---------- Problema ---------- */
const dores = [
  { icon: Clock, t: "Ficha do zero, toda vez.", d: "Cada aluno novo vira horas de planilha, e cada ajuste vira outra versão no WhatsApp." },
  { icon: BellRing, t: "Aluno some e você só descobre tarde.", d: "Sem sinal de frequência, o abandono aparece quando já virou cancelamento." },
  { icon: CreditCard, t: "Cobrar é desconfortável.", d: "Lembrar mensalidade por mensagem desgasta a relação e atrasa o seu caixa." },
]

function Spot({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <MagicCard
      gradientColor="#3a1216"
      gradientFrom="#ff6f78"
      gradientTo="#b1111b"
      gradientOpacity={0.55}
      gradientSize={260}
      className={cn("h-full rounded-3xl", className)}
    >
      {children}
    </MagicCard>
  )
}

export function Problema() {
  return (
    <section id="problema" aria-labelledby="h-prob" className="relative py-20 md:py-28">
      <Container>
        <SectionHead
          id="h-prob"
          eyebrow="O problema"
          title={<>Seu talento é treinar. <span className="text-faint">O resto virou trabalho de escritório.</span></>}
          lead="Planilha, áudio, lembrete de pagamento. Tudo isso te tira da quadra."
        />
        <ul className="grid gap-4 md:grid-cols-3">
          {dores.map((d, i) => (
            <li key={d.t}>
              <BlurFade inView delay={i * 0.1} className="h-full">
                <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="h-full">
                  <Spot>
                    <div className="relative flex h-full flex-col p-7 md:p-8">
                      <span className="mb-10 flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-accent">
                        <d.icon size={22} />
                      </span>
                      <span className="mb-3 text-xs font-semibold tabular-nums text-faint">0{i + 1}</span>
                      <h3 className="text-xl font-bold tracking-tight md:text-[22px]">{d.t}</h3>
                      <p className="mt-3 leading-relaxed text-muted">{d.d}</p>
                    </div>
                  </Spot>
                </motion.div>
              </BlurFade>
            </li>
          ))}
        </ul>
        <BlurFade inView delay={0.2}>
          <p className="mt-10 border-l-4 border-primary pl-5 text-xl font-medium leading-snug md:text-2xl">
            O aura-fit assume o repetitivo. <span className="text-muted">A decisão profissional continua sendo sua.</span>
          </p>
        </BlurFade>
      </Container>
    </section>
  )
}

/* ---------- Manifesto (texto revelado pela rolagem) ---------- */
function Word({ children, progress, range, accent }: { children: string; progress: MotionValue<number>; range: [number, number]; accent?: boolean }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  const y = useTransform(progress, range, [8, 0])
  return (
    <motion.span style={{ opacity, y }} className={cn("mr-[0.24em] inline-block", accent && "text-grad")}>
      {children}
    </motion.span>
  )
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.6"] })
  const { scrollYProgress: par } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const imgY = useTransform(par, [0, 1], ["-8%", "8%"])
  const text = "A IA sugere. Você decide. O aura-fit cuida do trabalho repetitivo."
  const words = text.split(" ")
  const accents = new Set(["Você", "decide."])

  return (
    <section ref={ref} id="manifesto" aria-labelledby="h-man" className="px-3 md:px-6">
      <div className="noise relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] border border-line md:rounded-[40px]">
        <motion.img style={{ y: imgY }} src="./img/foto-faixa.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-[116%] w-full object-cover object-[60%_20%]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-bg from-25% via-bg/85 via-55% to-bg/20 max-md:bg-bg/85" />
        <div className="relative px-6 py-24 md:px-16 md:py-40">
          <Eyebrow>Manifesto</Eyebrow>
          <h2 id="h-man" aria-label={text} className="display mt-6 max-w-[12ch] text-[clamp(38px,5.6vw,80px)]">
            {words.map((w, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={accents.has(w)}>
                {w}
              </Word>
            ))}
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            Cada proposta passa pela sua revisão antes de chegar ao aluno. A responsabilidade profissional continua sendo sua.
          </p>
          <p className="mt-10 text-[11px] text-faint">Foto ilustrativa.</p>
        </div>
      </div>
    </section>
  )
}

/* ---------- Recursos (bento com mini-interfaces animadas) ---------- */
const treino = [
  { n: "Agachamento livre", s: "4 × 10" },
  { n: "Leg press 45°", s: "3 × 12" },
  { n: "Cadeira extensora", s: "3 × 15" },
  { n: "Stiff com barra", s: "3 × 12" },
]
const pedido = "Aluna iniciante, 3x por semana, foco em pernas. Cuidado com a lombar."

function MockIA() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-20% 0px" })
  const [step, setStep] = useState(0) // 0 digitando · 1 gerando · 2 lista · 3 aprovado
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (!inView) return
    let t: ReturnType<typeof setTimeout>
    if (step === 0) {
      if (typed < pedido.length) t = setTimeout(() => setTyped((v) => v + 1), 26)
      else t = setTimeout(() => setStep(1), 500)
    } else if (step === 1) t = setTimeout(() => setStep(2), 1100)
    else if (step === 2) t = setTimeout(() => setStep(3), 3200)
    else t = setTimeout(() => { setTyped(0); setStep(0) }, 2600)
    return () => clearTimeout(t)
  }, [inView, step, typed])

  return (
    <div ref={ref} aria-hidden="true" className="grid gap-3 text-sm md:grid-cols-[.9fr_1.1fr]">
      <div className="rounded-2xl border border-line bg-bg/80 p-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">Seu pedido</p>
        <p className="min-h-[84px] leading-relaxed text-ink">
          {pedido.slice(0, typed)}
          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-accent" />
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          <Sparkles size={14} className={cn("text-accent", step === 1 && "animate-spin")} />
          {step === 0 ? "Descreva em linguagem natural" : step === 1 ? "Montando proposta…" : "Proposta pronta para revisão"}
        </div>
      </div>
      <div className="relative rounded-2xl border border-line bg-bg/80 p-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">Proposta da IA [MOCK]</p>
        <ul className="min-h-[156px] space-y-1.5">
          <AnimatePresence>
            {step >= 2 &&
              treino.map((e, i) => (
                <motion.li
                  key={e.n}
                  initial={{ opacity: 0, x: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-between rounded-xl bg-surface px-3 py-2"
                >
                  <span className="text-ink">{e.n}</span>
                  <span className="tabular-nums text-muted">{e.s}</span>
                </motion.li>
              ))}
          </AnimatePresence>
        </ul>
        <div className={cn("relative mt-3 flex h-10 items-center justify-center gap-2 overflow-hidden rounded-xl text-[13px] font-semibold transition-colors duration-500", step === 3 ? "bg-ok/15 text-ok" : "bg-primary text-white")}>
          {step === 3 ? <><Check size={16} /> Aprovado e enviado</> : <><Send size={15} /> Aprovar e enviar</>}
          {step === 2 && <BorderBeam size={60} duration={3} colorFrom="#ffffff" colorTo="#ff6f78" />}
        </div>
      </div>
    </div>
  )
}

const semanas = [92, 88, 80, 71, 52, 34]
function MockAderencia() {
  return (
    <div aria-hidden="true" className="rounded-2xl border border-line bg-bg/80 p-4">
      <div className="mb-4 flex items-center justify-between text-xs">
        <span className="font-semibold text-ink">Aluno B · frequência [MOCK]</span>
        <motion.span animate={{ opacity: [1, 0.45, 1] }} transition={{ duration: 1.6, repeat: Infinity }} className="inline-flex items-center gap-1 rounded-full bg-warn/15 px-2 py-1 font-semibold text-warn">
          <AlertTriangle size={12} /> Risco
        </motion.span>
      </div>
      <div className="flex h-28 items-end gap-2">
        {semanas.map((h, i) => (
          <div key={i} className="flex h-full flex-1 flex-col justify-end gap-1.5">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: 0.15 + i * 0.09, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: `${h}%` }}
              className={cn("origin-bottom rounded-md", i >= 4 ? "bg-gradient-to-t from-brand to-accent" : "bg-surface-2")}
            />
            <span className="text-center text-[10px] text-faint">S{i + 1}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted"><TrendingDown size={14} className="text-accent" /> Ritmo caiu nas últimas 2 semanas</p>
    </div>
  )
}

function Pay({ n, s, tone }: { n: string; s: string; tone: string }) {
  return (
    <div className="flex w-full items-center justify-between rounded-xl bg-surface px-3 py-2.5 text-sm">
      <span className="text-ink">{n}</span>
      <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", tone)}>{s}</span>
    </div>
  )
}
function MockCobranca() {
  return (
    <div aria-hidden="true" className="rounded-2xl border border-line bg-bg/80 p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-faint">Novembro [MOCK]</p>
      <div className="h-[150px] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_75%,transparent)]">
        <AnimatedList delay={1700} className="gap-2">
          <Pay key="1" n="Aluno A" s="Pago" tone="bg-ok/15 text-ok" />
          <Pay key="2" n="Aluno B" s="Lembrete enviado" tone="bg-warn/15 text-warn" />
          <Pay key="3" n="Aluno C" s="Atrasado" tone="bg-bad/15 text-bad" />
          <Pay key="4" n="Aluno D" s="Pago" tone="bg-ok/15 text-ok" />
          <Pay key="5" n="Aluno C" s="Pago pelo link" tone="bg-ok/15 text-ok" />
        </AnimatedList>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted"><Link2 size={14} className="text-accent" /> Link de pagamento no lembrete</p>
    </div>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {items.map((b) => (
        <li key={b} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-[13px] text-muted">
          <Check size={14} className="text-ok" /> {b}
        </li>
      ))}
    </ul>
  )
}

export function Recursos() {
  return (
    <section id="recursos" aria-labelledby="h-rec" className="relative py-20 md:py-28">
      <DotPattern width={26} height={26} cr={1} className="text-white/[0.09] [mask-image:radial-gradient(60%_50%_at_50%_30%,#000,transparent)]" />
      <Container className="relative">
        <SectionHead
          id="h-rec"
          eyebrow="Recursos"
          title={<>Prescrição, aderência e cobrança. <span className="text-grad">Um fluxo só.</span></>}
          lead="Três frentes que hoje vivem em planilha, áudio e mensagem, organizadas num lugar."
        />

        <div className="grid gap-4 lg:grid-cols-6">
          <BlurFade inView className="lg:col-span-6">
            <Spot>
              <article className="grid gap-8 p-6 md:p-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Prescrição com IA</p>
                  <h3 className="mt-3 text-3xl font-bold tracking-tight md:text-[40px] md:leading-[1.05]">Descreva. Revise. Envie.</h3>
                  <p className="mt-4 leading-relaxed text-muted">
                    Escreva o objetivo e as restrições do aluno em linguagem natural. A IA monta uma proposta de treino. Você ajusta e aprova. Nada vai ao aluno sem o seu aval.
                  </p>
                  <Bullets items={["Proposta para você revisar", "Edição livre antes de enviar", "A IA sugere, o personal decide"]} />
                  <p className="mt-5 text-[13px] leading-relaxed text-faint">
                    A IA é uma ferramenta de apoio. Não substitui sua avaliação profissional. Dados de saúde e fotos do aluno só seguiriam para recursos de IA com o consentimento dele [a definir].
                  </p>
                </div>
                <MockIA />
              </article>
            </Spot>
          </BlurFade>

          <BlurFade inView delay={0.08} className="lg:col-span-3">
            <Spot>
              <article className="flex h-full flex-col gap-7 p-6 md:p-10">
                <MockAderencia />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Aderência</p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">Veja quem está se afastando.</h3>
                  <p className="mt-3 leading-relaxed text-muted">
                    Acompanhe a frequência de cada aluno e receba o alerta quando o ritmo cai. Isso ajuda você a chamar o aluno antes que ele se afaste.
                  </p>
                  <Bullets items={["Painel por aluno", "Sinal de queda de frequência", "Histórico de treinos concluídos"]} />
                </div>
              </article>
            </Spot>
          </BlurFade>

          <BlurFade inView delay={0.16} className="lg:col-span-3">
            <Spot>
              <article className="flex h-full flex-col gap-7 p-6 md:p-10">
                <MockCobranca />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Régua de cobrança</p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">Cobrança sem constrangimento.</h3>
                  <p className="mt-3 leading-relaxed text-muted">
                    Configure lembretes e link de pagamento. O aura-fit avisa o aluno por você e mostra quem está em dia.
                  </p>
                  <Bullets items={["Lembretes automáticos", "Link de pagamento", "Visão de inadimplência"]} />
                  <p className="mt-5 text-[13px] text-faint">Meios de pagamento e taxas [a confirmar].</p>
                </div>
              </article>
            </Spot>
          </BlurFade>
        </div>

        <BlurFade inView delay={0.1}>
          <p className="mt-6 rounded-2xl border border-dashed border-line-strong p-5 text-sm leading-relaxed text-faint">
            <span className="mr-2 inline-flex rounded-md bg-warn/10 px-1.5 py-0.5 text-[11px] font-semibold text-warn">Em avaliação [a confirmar]</span>
            treino com vídeo por exercício, white-label (logo e cores próprias), cadastro de equipamentos, anamnese e avaliação física com fotos de progresso. Dados de saúde e fotos só iriam à IA com o consentimento do aluno [a definir]. Nenhum deles é compromisso de entrega.
          </p>
          <div className="mt-8">
            <Btn href="#cta-final" title="Cadastro em breve [a definir]">Testar com meus alunos <ArrowRight size={18} /></Btn>
          </div>
        </BlurFade>
      </Container>
    </section>
  )
}

/* ---------- Telas do app (celular fixo, textos rolando) ---------- */
const telas = [
  {
    k: "treino",
    t: "Treino do dia, exercício por exercício.",
    d: "O aluno abre o app e vê o treino de hoje: séries, repetições e descanso de cada movimento, sem planilha no WhatsApp.",
    a: "Captura do app em desenvolvimento, com dados de exemplo [MOCK].",
    img: "./img/tela-aluno-treino.png",
    alt: "Tela do aplicativo do aluno, Treino de hoje: Treino A Superior, cerca de 45 minutos, 5 exercícios, com séries, repetições e descanso de supino reto, remada curvada e desenvolvimento com halteres.",
    dark: false,
  },
  {
    k: "ia",
    t: "A IA sugere. Você revisa, escolhe e salva.",
    d: "Na prescrição com IA, você passa o contexto e o pedido, recebe as sugestões com os pontos de atenção e decide o que entra no treino.",
    a: "Captura do app em desenvolvimento. A IA pode errar: nada vai ao aluno sem a sua aprovação. Limite de sugestões por mês [MOCK].",
    img: "./img/tela-prescricao-ia.png",
    alt: "Tela Prescrição com IA do personal: aviso de que a IA só sugere e o personal decide, 18 de 30 sugestões no mês, etapas de contexto, pedido, dados, resumo e resultado, com 6 sugestões e 3 pontos de atenção.",
    dark: false,
  },
  {
    k: "painel",
    t: "Alunos, receita e alertas em um só painel.",
    d: "Veja quantos alunos ativos cabem no seu plano, a receita do mês, quem está sem treinar há 7 dias ou mais e a agenda de hoje.",
    a: "Captura do app em desenvolvimento, valores de exemplo [MOCK]. Meios de pagamento [a confirmar].",
    img: "./img/tela-personal-painel.png",
    alt: "Tela inicial do personal em tema escuro: 18 de 30 alunos ativos do plano, receita do mês de R$ 4.250,00, 4 alunos sem treinar há 7 dias ou mais e 4 compromissos na agenda de hoje.",
    dark: true,
  },
] as const

function TelaVisual({ i }: { i: number }) {
  const t = telas[i]
  return <Phone src={t.img} alt={t.alt} dark={t.dark} className="w-[min(100%,290px,34svh)]" />
}

function TelaTexto({ i, onActive }: { i: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" })
  useEffect(() => { if (inView) onActive(i) }, [inView, i, onActive])
  const t = telas[i]
  return (
    <div ref={ref} className="flex flex-col justify-center py-10 lg:min-h-[72vh] lg:py-0">
      <motion.div animate={{ opacity: inView ? 1 : 0.28 }} transition={{ duration: 0.5 }} className="max-lg:!opacity-100">
        <span className="display text-6xl text-white/10 tabular-nums">0{i + 1}</span>
        <h3 className="mt-4 text-3xl font-bold tracking-tight md:text-[40px] md:leading-[1.08]">{t.t}</h3>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{t.d}</p>
        <p className="mt-4 max-w-md text-[13px] text-faint">{t.a}</p>
      </motion.div>
      <div className="mt-8 lg:hidden"><TelaVisual i={i} /></div>
    </div>
  )
}

export function Telas() {
  const [active, setActive] = useState(0)
  return (
    <section id="telas" aria-labelledby="h-telas" className="relative border-y border-line bg-surface/40 py-20 md:py-28">
      <Container>
        <SectionHead
          id="h-telas"
          eyebrow="O app por dentro"
          title="O treino, a prescrição e o painel no bolso."
          lead="Capturas do app em desenvolvimento, com dados de exemplo [MOCK]. Nomes, valores e recursos podem mudar [a confirmar]."
        />
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            {telas.map((t, i) => <TelaTexto key={t.k} i={i} onActive={setActive} />)}
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-[18vh] flex h-[72vh] items-center justify-center">
              <div aria-hidden="true" className="absolute size-[460px] rounded-full bg-primary/25 blur-[120px]" />
              <motion.div aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute size-[520px] rounded-full border border-dashed border-white/10" />
              <div aria-hidden="true" className="absolute size-[380px] rounded-full border border-white/[0.07]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 40, rotate: 5, scale: 0.94, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -40, rotate: -5, scale: 0.94, filter: "blur(10px)" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full"
                >
                  <TelaVisual i={active} />
                </motion.div>
              </AnimatePresence>
              <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col gap-2" aria-hidden="true">
                {telas.map((t, i) => (
                  <motion.span key={t.k} animate={{ height: active === i ? 36 : 10, backgroundColor: active === i ? "#d0202b" : "#4a4a4a" }} className="w-1.5 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ---------- Como funciona ---------- */
const passos = [
  { icon: UserPlus, t: "Cadastre seus alunos", d: "Convide pelo link ou adicione manualmente." },
  { icon: Sparkles, t: "Prescreva com vídeo e IA", d: "Descreva o que o aluno precisa, revise e envie." },
  { icon: Activity, t: "Acompanhe e cobre", d: "Veja frequência, receba alertas e deixe a cobrança no automático." },
]

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] })
  return (
    <section id="como-funciona" aria-labelledby="h-como" className="py-20 md:py-28">
      <Container>
        <SectionHead id="h-como" center eyebrow="Como funciona" title="Do cadastro ao primeiro treino em 3 passos" />
        <ol ref={ref} className="relative grid gap-10 md:grid-cols-3 md:gap-6">
          <div aria-hidden="true" className="absolute left-7 top-0 h-full w-px bg-line md:left-0 md:top-7 md:h-px md:w-full" />
          <motion.div aria-hidden="true" style={{ scaleX: scrollYProgress }} className="absolute left-0 top-7 hidden h-px w-full origin-left bg-gradient-to-r from-brand via-primary to-accent md:block" />
          <motion.div aria-hidden="true" style={{ scaleY: scrollYProgress }} className="absolute left-7 top-0 h-full w-px origin-top bg-gradient-to-b from-brand via-primary to-accent md:hidden" />
          {passos.map((p, i) => (
            <li key={p.t} className="relative pl-20 md:pl-0">
              <BlurFade inView delay={i * 0.14}>
                <motion.span
                  whileInView={{ scale: [0.6, 1.12, 1] }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ delay: 0.2 + i * 0.14, duration: 0.6 }}
                  className="absolute left-0 top-0 flex size-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-[0_0_0_8px_var(--color-bg),0_0_40px_rgb(208_32_43/.55)] md:relative"
                >
                  {i + 1}
                </motion.span>
                <div className="md:mt-8">
                  <p.icon size={22} className="mb-3 text-accent" />
                  <h3 className="text-2xl font-bold tracking-tight">{p.t}</h3>
                  <p className="mt-2 max-w-xs leading-relaxed text-muted">{p.d}</p>
                </div>
              </BlurFade>
            </li>
          ))}
        </ol>
        <BlurFade inView delay={0.2}>
          <div className="mt-14 flex flex-col items-center gap-3 text-center">
            <Btn href="#cta-final" title="Cadastro em breve [a definir]">Criar minha conta grátis <ArrowRight size={18} /></Btn>
            <p className="text-sm text-faint">Leva minutos para configurar o primeiro aluno <Mock /></p>
          </div>
        </BlurFade>
      </Container>
    </section>
  )
}
