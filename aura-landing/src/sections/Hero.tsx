import { ArrowRight, BellRing, CheckCircle2, CreditCard, Menu, Sparkles, X } from "lucide-react"
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react"
import { useRef, useState } from "react"

import { AnimatedList } from "@/components/magicui/animated-list"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"
import { BlurFade } from "@/components/magicui/blur-fade"
import { BorderBeam } from "@/components/magicui/border-beam"
import { LightRays } from "@/components/magicui/light-rays"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { Particles } from "@/components/magicui/particles"
import { ScrollProgress } from "@/components/magicui/scroll-progress"
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/magicui/scroll-based-velocity"
import { TextAnimate } from "@/components/magicui/text-animate"
import { Btn, Container, Logo, Phone } from "@/components/ui"
import { cn } from "@/lib/utils"

const links = [
  { href: "#recursos", label: "Recursos" },
  { href: "#roi", label: "Calculadora" },
  { href: "#planos", label: "Planos" },
  { href: "#comparativo", label: "Comparativo" },
  { href: "#faq", label: "FAQ" },
]

export function TopBar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24))

  return (
    <div className="sticky top-0 z-50">
      <div className="relative">
        <ScrollProgress className="absolute left-0 top-0 h-[3px] bg-gradient-to-r from-brand via-primary to-accent" />
      </div>
      <header className="px-3 pt-3">
        <motion.div
          animate={{ maxWidth: scrolled ? 920 : 1200 }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
          className={cn(
            "mx-auto flex h-14 items-center gap-2 rounded-full border px-4 transition-colors duration-500 md:px-5",
            scrolled || open ? "glass border-line shadow-[0_10px_40px_-12px_rgb(0_0_0/.8)]" : "border-transparent",
          )}
        >
          <Logo className="mr-auto" />
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-flex h-11 items-center rounded-full px-3.5 text-sm font-medium text-muted transition-colors hover:bg-white/[0.06] hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Btn href="https://aura.teotonio.xyz/login" className="hidden h-10 px-5 text-sm sm:inline-flex">
            Começar grátis
          </Btn>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-ink md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </motion.div>
        <AnimatePresence>
          {open && (
            <motion.nav
              id="menu-mobile"
              aria-label="Principal (mobile)"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="glass mx-auto mt-2 max-w-[1200px] rounded-3xl border border-line p-3 md:hidden"
            >
              <ul>
                {links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} onClick={() => setOpen(false)} className="flex h-12 items-center rounded-2xl px-4 text-base font-medium text-ink hover:bg-white/[0.06]">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Btn href="https://aura.teotonio.xyz/login" className="mt-2 w-full">
                Começar grátis
              </Btn>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </div>
  )
}

function Notif({ icon, title, sub, tone }: { icon: React.ReactNode; title: string; sub: string; tone: string }) {
  return (
    <div className="glass flex w-[272px] items-center gap-3 rounded-2xl border border-white/10 p-3 shadow-[0_18px_50px_-18px_rgb(0_0_0/.9)]">
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", tone)}>{icon}</span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-semibold text-ink">{title}</span>
        <span className="block truncate text-xs text-muted">{sub}</span>
      </span>
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12])
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -110])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} id="topo" className="noise relative -mt-[68px] overflow-hidden pt-[68px]">
      {/* foto + luz */}
      <div className="absolute inset-0" aria-hidden="true">
        <motion.div style={{ y: photoY, scale: photoScale }} className="absolute inset-y-0 right-0 w-full md:left-[26%] md:w-[58%]">
          <img src="./img/foto-atleta-faixa.webp" alt="" className="size-full object-cover object-[50%_12%] opacity-70 md:opacity-100 md:[mask-image:linear-gradient(to_right,transparent,#000_30%,#000_72%,transparent)]" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-bg from-[28%] via-bg/45 via-[50%] to-transparent max-md:bg-gradient-to-t max-md:from-bg max-md:via-bg/85 max-md:to-bg/45" />
        <div className="glow-floor" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-bg to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg/90 to-transparent" />
        <LightRays count={6} color="rgba(208, 32, 43, 0.28)" blur={42} speed={13} length="85vh" />
        <Particles className="absolute inset-0" quantity={70} color="#ff6f78" size={0.5} staticity={40} ease={70} />
      </div>

      <Container className="relative z-10 grid min-h-[clamp(680px,94svh,980px)] items-center gap-10 pb-20 pt-16 md:grid-cols-[1.15fr_.85fr]">
        <motion.div style={{ y: textY, opacity: fade }}>
          <BlurFade delay={0.05}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] py-1.5 pl-2 pr-4 backdrop-blur">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                <Sparkles size={12} /> IA
              </span>
              <AnimatedShinyText className="mx-0 max-w-none text-[13px] font-medium text-muted">
                Para personal trainers
              </AnimatedShinyText>
            </div>
          </BlurFade>

          <h1 className="display mt-7 text-[clamp(40px,6.2vw,92px)]">
            <span className="sr-only">Menos planilha. Mais aluno treinando.</span>
            <span aria-hidden="true" className="block">
              <TextAnimate as="span" by="word" animation="blurInUp" duration={0.7} delay={0.15} once accessible={false} className="inline">
                Menos
              </TextAnimate>{" "}
              <TextAnimate as="span" by="character" animation="blurInUp" duration={0.6} delay={0.3} once accessible={false} className="inline-block whitespace-nowrap" segmentClassName="text-grad">
                planilha.
              </TextAnimate>
            </span>
            <span aria-hidden="true" className="block">
              <TextAnimate as="span" by="word" animation="blurInUp" duration={0.7} delay={0.55} once accessible={false} className="inline">
                Mais aluno
              </TextAnimate>{" "}
              <TextAnimate as="span" by="character" animation="blurInUp" duration={0.6} delay={0.8} once accessible={false} className="inline-block whitespace-nowrap" segmentClassName="text-grad">
                treinando.
              </TextAnimate>
            </span>
          </h1>

          <BlurFade delay={1.0}>
            <p className="mt-7 max-w-[34rem] text-lg leading-relaxed text-muted md:text-xl">
              Treino com vídeo, app do aluno, frequência e cobrança no mesmo lugar. A IA monta a proposta, você revisa e aprova.
            </p>
          </BlurFade>

          <BlurFade delay={1.15}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Btn href="https://aura.teotonio.xyz/login" className="h-14 px-8 text-base">
                Começar grátis <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Btn>
              <Btn href="#como-funciona" variant="ghost" className="h-14 px-8 text-base">
                Ver como funciona
              </Btn>
            </div>
          </BlurFade>

          <BlurFade delay={1.3}>
            <p className="mt-6 max-w-[34rem] text-sm leading-relaxed text-faint">
              Starter sem custo. Sem cartão para começar. Feito para personal autônomo e pequeno estúdio.
            </p>
          </BlurFade>
        </motion.div>

        {/* celular flutuante + notificações */}
        <div className="relative hidden h-full min-h-[560px] md:block">
          <motion.div style={{ y: phoneY }} className="absolute bottom-6 right-0 w-[min(100%,400px)]">
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 [perspective:1400px]"
            >
              <div className="animate-float">
                <Phone
                  src="./img/tela-aluno-inicio.png"
                  alt="Tela do aplicativo do aluno: saudação, treino de hoje (Treino A: Superior, 45 minutos, 5 exercícios) e sequência de 3 semanas ativas."
                  className="w-[300px] [transform:rotateY(-16deg)_rotateX(8deg)_rotateZ(5deg)]"
                />
              </div>
            </motion.div>
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-0 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[110px]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="absolute -left-36 bottom-2 z-20 h-[230px] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]"
            aria-hidden="true"
          >
            <AnimatedList delay={2200} className="items-start gap-2.5">
              <Notif key="a" tone="bg-ok/15 text-ok" icon={<CheckCircle2 size={18} />} title="Aluno A concluiu o treino" sub="Treino A: Superior" />
              <Notif key="b" tone="bg-primary/20 text-accent" icon={<Sparkles size={18} />} title="Proposta da IA pronta" sub="Revise e aprove antes de enviar" />
              <Notif key="c" tone="bg-warn/15 text-warn" icon={<BellRing size={18} />} title="Aluno B faltou 2 treinos" sub="Sinal de queda de frequência" />
              <Notif key="d" tone="bg-ok/15 text-ok" icon={<CreditCard size={18} />} title="Pagamento recebido" sub="Mensalidade de novembro" />
            </AnimatedList>
          </motion.div>
        </div>
      </Container>
      <p className="absolute bottom-3 right-5 z-10 text-[11px] text-faint">Foto ilustrativa.</p>
    </section>
  )
}

const stats = [
  { value: 6, prefix: "", suffix: " h", label: "por semana: menos tempo montando ficha e cobrando" },
  { value: 92, prefix: "", suffix: "%", label: "dos treinos com vídeo visualizados pelos alunos" },
  { value: 38, prefix: "−", suffix: "%", label: "de atrasos de pagamento após a régua de cobrança" },
  { value: 1200, prefix: "", suffix: "", label: "treinos prescritos por mês na plataforma" },
]

export function Stats() {
  return (
    <section id="numeros" aria-labelledby="h-num" className="relative overflow-hidden border-y border-line bg-surface/40">
      <img src="./img/foto-halteres.webp" alt="" aria-hidden="true" loading="lazy" className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[46%] object-cover object-[50%_32%] opacity-40 [mask-image:linear-gradient(to_left,#000,transparent)] lg:block" />
      <Container className="relative py-14 md:py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 id="h-num" className="text-2xl font-bold tracking-tight md:text-3xl">O que muda na rotina.</h2>
          <p className="max-w-xl text-sm leading-relaxed text-faint">
            Resultados variam. São indicadores de gestão do personal, não resultado de saúde ou estética do aluno.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <BlurFade key={s.label} inView delay={i * 0.08} className="bg-bg">
              <div className="group relative h-full p-6 md:p-8">
                <dd className="display whitespace-nowrap text-[clamp(34px,4.6vw,66px)] tabular-nums text-ink">
                  <span className="text-accent">{s.prefix}</span>
                  <NumberTicker value={s.value} className="text-ink" />
                  <span className="text-accent">{s.suffix}</span>
                </dd>
                <dt className="mt-3 text-sm leading-relaxed text-muted">
                  {s.label} <span className="text-faint"></span>
                </dt>
                <span aria-hidden="true" className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-primary to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100" />
              </div>
            </BlurFade>
          ))}
        </dl>
      </Container>
    </section>
  )
}

const l1 = ["Treino com vídeo", "Ficha pronta em minutos", "A IA sugere. Você decide.", "Aluno com app no bolso", "Cobrança no automático", "Quem sumiu? Você sabe antes", "Menos WhatsApp, mais treino", "Você no comando"]
const l2 = ["Fichas", "Alunos", "Alertas", "Progresso", "Pagamentos", "Treinos", "Rotina", "Ritmo"]

export function Ticker() {
  return (
    <section aria-label="Destaques" className="relative overflow-hidden py-14 md:py-20">
      <p className="sr-only">{l1.join(" · ")}</p>
      <div aria-hidden="true">
        <ScrollVelocityContainer className="display text-[clamp(34px,6vw,84px)]">
          <ScrollVelocityRow baseVelocity={3} direction={1}>
            {l1.map((t) => (
              <span key={t} className="mx-6 inline-flex items-center gap-12 text-ink">
                {t}
                <span className="inline-block size-3 rounded-full bg-primary md:size-4" />
              </span>
            ))}
          </ScrollVelocityRow>
          <ScrollVelocityRow baseVelocity={3} direction={-1} className="mt-3">
            {l2.map((t) => (
              <span key={t} className="mx-6 inline-flex items-center gap-12 text-transparent [-webkit-text-stroke:1.5px_var(--color-line-strong)]">
                {t}
                <span className="inline-block size-3 rounded-full border-2 border-line-strong md:size-4" />
              </span>
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent md:w-48" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent md:w-48" />
    </section>
  )
}

/* BorderBeam é reexportado aqui para manter os imports dos kits num lugar só */
export { BorderBeam }
