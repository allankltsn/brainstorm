import { Activity, BellRing, Check, CreditCard, Dumbbell, Sparkles, Video } from "lucide-react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react"
import type { ReactNode } from "react"

import { BlurFade } from "@/components/magicui/blur-fade"
import { Btn, Container, SectionHead } from "@/components/ui"
import { cn } from "@/lib/utils"

/* "Por que usar o aura-fit": cartões que inclinam com o ponteiro e mini-ilustrações animadas.
   Padrões inspirados no affectUI (Tilt Card, Grid Background, Enrichment Orbit, Integration Flow,
   Layer Stack, Team Invite), reescritos com a marca do aura-fit. */

/** Cartão que inclina em 3D na direção do ponteiro, com brilho acompanhando. */
export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const rx = useSpring(0, { stiffness: 180, damping: 18 })
  const ry = useSpring(0, { stiffness: 180, damping: 18 })
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgb(255 111 120 / .16), transparent 60%)`
  return (
    <div className="h-full [perspective:1100px]">
      <motion.div
        style={{ rotateX: rx, rotateY: ry }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width
          const py = (e.clientY - r.top) / r.height
          ry.set((px - 0.5) * 9)
          rx.set((0.5 - py) * 9)
          gx.set(px * 100)
          gy.set(py * 100)
        }}
        onMouseLeave={() => { rx.set(0); ry.set(0) }}
        className={cn("group relative h-full overflow-hidden rounded-3xl border border-line bg-surface transition-colors duration-500 hover:border-primary-line", className)}
      >
        <motion.div aria-hidden="true" style={{ background: glare }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {children}
      </motion.div>
    </div>
  )
}

const Stage = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div aria-hidden="true" className={cn("grid-drift relative flex h-52 items-center justify-center overflow-hidden border-b border-line bg-bg/60", className)}>{children}</div>
)

/* 1 · tudo num lugar: órbitas em volta do aura-fit */
function IlOrbita() {
  const nodes = [
    { I: Dumbbell, r: 62, d: 14, a: 0 },
    { I: Video, r: 62, d: 14, a: 180 },
    { I: Activity, r: 92, d: 22, a: 70 },
    { I: CreditCard, r: 92, d: 22, a: 250 },
  ]
  return (
    <Stage>
      {[62, 92].map((r) => <span key={r} className="absolute rounded-full border border-dashed border-white/15" style={{ width: r * 2, height: r * 2 }} />)}
      {nodes.map(({ I, r, d, a }, i) => (
        <motion.span key={i} className="absolute" style={{ width: r * 2, height: r * 2 }} initial={{ rotate: a }} animate={{ rotate: a + 360 }} transition={{ duration: d, repeat: Infinity, ease: "linear" }}>
          <motion.span className="absolute -top-4 left-1/2 -ml-4 flex size-8 items-center justify-center rounded-xl border border-line-strong bg-surface text-accent shadow-lg" initial={{ rotate: -a }} animate={{ rotate: -a - 360 }} transition={{ duration: d, repeat: Infinity, ease: "linear" }}>
            <I size={15} />
          </motion.span>
        </motion.span>
      ))}
      <span className="relative flex size-14 items-center justify-center rounded-2xl bg-bg shadow-[0_0_40px_rgb(208_32_43/.6)] ring-1 ring-primary-line">
        <svg width="30" height="30" viewBox="0 0 28 28"><circle cx="14" cy="14" r="11" fill="none" stroke="#d0202b" strokeWidth="3" /><circle cx="14" cy="14" r="4.5" fill="#d0202b" /></svg>
      </span>
    </Stage>
  )
}

/* 2 · tempo de volta: pilha de fichas que abre em leque no hover */
function IlPilha() {
  const cards = [
    { r: -10, x: -46, t: "Planilha v7" },
    { r: 0, x: 0, t: "Ficha pronta" },
    { r: 10, x: 46, t: "Áudio 3:12" },
  ]
  return (
    <Stage>
      {cards.map((c, i) => (
        <span
          key={c.t}
          className={cn("fan absolute w-32 rounded-xl border p-3 shadow-xl", i === 1 ? "z-10 border-primary-line bg-surface" : "border-line bg-surface-2")}
          style={{ ["--x0" as string]: `${c.x * 0.35}px`, ["--r0" as string]: `${c.r * 0.4}deg`, ["--tx" as string]: `${c.x * 1.7}px`, ["--rt" as string]: `${c.r * 1.4}deg` }}
        >
          <span className="block">
            <span className="mb-2 flex items-center justify-between text-[10px] font-semibold text-ink">
              {c.t}
              {i === 1 && <Check size={12} className="text-ok" />}
            </span>
            {[70, 90, 55].map((w) => <span key={w} className={cn("mb-1.5 block h-1.5 rounded-full", i === 1 ? "bg-primary/60" : "bg-white/15")} style={{ width: `${w}%` }} />)}
          </span>
        </span>
      ))}
      <span className="absolute bottom-3 right-4 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-white">em minutos</span>
    </Stage>
  )
}

/* 3 · você decide: sugestão da IA passando pelo seu aval */
function IlAval() {
  return (
    <Stage>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-2 text-[11px] font-semibold text-muted"><Sparkles size={13} className="text-accent" /> Sugestão da IA</span>
        <span className="relative h-px w-10 bg-line-strong">
          <motion.span className="absolute -top-[3px] size-[7px] rounded-full bg-accent" animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
        </span>
        <motion.span animate={{ scale: [1, 1.08, 1], boxShadow: ["0 0 0 0 rgb(208 32 43 / .5)", "0 0 0 10px rgb(208 32 43 / 0)", "0 0 0 0 rgb(208 32 43 / 0)"] }} transition={{ duration: 1.8, repeat: Infinity }} className="flex size-11 items-center justify-center rounded-full bg-primary text-white">
          <Check size={20} />
        </motion.span>
        <span className="relative h-px w-10 bg-line-strong">
          <motion.span className="absolute -top-[3px] size-[7px] rounded-full bg-ok" animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.9 }} />
        </span>
        <span className="rounded-xl border border-line bg-surface px-3 py-2 text-[11px] font-semibold text-muted">Aluno</span>
      </div>
      <span className="absolute bottom-3 text-[11px] text-faint">nada passa sem o seu aval</span>
    </Stage>
  )
}

/* 4 · aluno mais perto: sequência da semana preenchendo */
function IlSequencia() {
  const dias = ["S", "T", "Q", "Q", "S", "S", "D"]
  return (
    <Stage>
      <div className="w-56 rounded-2xl border border-line bg-surface p-4">
        <p className="mb-3 flex items-center justify-between text-[11px] font-semibold text-ink">Sua sequência <span className="text-accent">3 semanas</span></p>
        <div className="flex justify-between">
          {dias.map((d, i) => (
            <span key={i} className="flex flex-col items-center gap-1.5 text-[10px] text-faint">
              {d}
              <motion.span
                className="flex size-6 items-center justify-center rounded-full border border-line-strong"
                animate={i < 5 ? { backgroundColor: ["rgba(82,216,138,0)", "rgba(82,216,138,.18)", "rgba(82,216,138,.18)", "rgba(82,216,138,0)"], borderColor: ["#4a4a4a", "#52d88a", "#52d88a", "#4a4a4a"] } : undefined}
                transition={{ duration: 5, times: [0, 0.1, 0.85, 1], delay: i * 0.35, repeat: Infinity }}
              >
                {i < 5 && (
                  <motion.span animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 5, times: [0, 0.1, 0.85, 1], delay: i * 0.35, repeat: Infinity }}>
                    <Check size={12} className="text-ok" />
                  </motion.span>
                )}
              </motion.span>
            </span>
          ))}
        </div>
      </div>
      <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 2.4, repeat: Infinity }} className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-warn/40 bg-warn/10 px-2.5 py-1 text-[10px] font-semibold text-warn">
        <BellRing size={11} /> ritmo caiu
      </motion.span>
    </Stage>
  )
}

/* 5 · cobrança: pulsos descendo pelos ramos até "Pago" */
function IlCobranca() {
  const ramos = [
    { x: 40, l: "Lembrete" },
    { x: 130, l: "Link" },
    { x: 220, l: "Pago" },
  ]
  return (
    <Stage>
      <svg viewBox="0 0 260 150" className="h-44 w-72">
        <rect x="100" y="8" width="60" height="26" rx="13" fill="#1f1f1f" stroke="#7a1a21" />
        <text x="130" y="25" textAnchor="middle" fontSize="10" fontWeight="700" fill="#f5f5f5">aura-fit</text>
        {ramos.map((r, i) => {
          const d = `M130 34 C 130 70, ${r.x} 60, ${r.x} 104`
          return (
            <g key={r.l}>
              <path id={`ramo${i}`} d={d} fill="none" stroke="#4a4a4a" strokeWidth="1.5" strokeDasharray="3 4" />
              <circle r="3.5" fill={i === 2 ? "#52d88a" : "#ff6f78"}>
                <animateMotion dur="2.2s" begin={`${i * 0.5}s`} repeatCount="indefinite"><mpath href={`#ramo${i}`} /></animateMotion>
              </circle>
              <rect x={r.x - 34} y="104" width="68" height="26" rx="9" fill="#1f1f1f" stroke={i === 2 ? "#52d88a" : "#3a3a3a"} strokeOpacity={i === 2 ? 0.6 : 1} />
              <text x={r.x} y="121" textAnchor="middle" fontSize="10" fontWeight="600" fill={i === 2 ? "#52d88a" : "#b0b0b0"}>{r.l}</text>
            </g>
          )
        })}
      </svg>
    </Stage>
  )
}

/* 6 · cresce com você: camadas (planos) que se destacam */
function IlCamadas() {
  const camadas = ["Starter", "Pro", "Premium"]
  return (
    <Stage>
      <div className="relative h-32 w-44 [perspective:600px]">
        {camadas.map((c, i) => (
          <motion.span
            key={c}
            className={cn("absolute inset-x-0 flex h-14 items-center justify-center rounded-2xl border text-xs font-bold", i === 1 ? "border-primary bg-primary text-white" : "border-line-strong bg-surface-2 text-muted")}
            style={{ bottom: i * 26, rotateX: 55, zIndex: i }}
            animate={{ y: [0, i === 1 ? -14 : 0, 0], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {c}
          </motion.span>
        ))}
      </div>
    </Stage>
  )
}

const beneficios = [
  { il: <IlOrbita />, t: "Tudo no mesmo lugar", d: "Treino, vídeo, frequência e cobrança num fluxo só. Menos abas abertas, menos conversa perdida no WhatsApp." },
  { il: <IlPilha />, t: "Tempo de volta na semana", d: "A IA monta a proposta e você revisa. Menos noite de domingo em planilha, mais hora com aluno ou descanso." },
  { il: <IlAval />, t: "Você decide, sempre", d: "A IA sugere e organiza. Nada chega ao aluno sem o seu aval, e a responsabilidade profissional continua sua." },
  { il: <IlSequencia />, t: "Aluno mais perto", d: "O aluno vê o treino do dia e a própria sequência. Quando o ritmo cai, você fica sabendo antes do cancelamento." },
  { il: <IlCobranca />, t: "Cobrança sem desgaste", d: "Lembrete e link de pagamento saem sozinhos. Você para de cobrar por mensagem e preserva a relação." },
  { il: <IlCamadas />, t: "Cresce com a sua carteira", d: "Comece no Starter sem custo [MOCK] e mude de plano quando tiver mais alunos. Sem cartão para começar [MOCK]." },
]

export function Porque() {
  return (
    <section id="por-que" aria-labelledby="h-pq" className="relative overflow-hidden py-20 md:py-28">
      <img src="./img/foto-halter-torso.webp" alt="" aria-hidden="true" loading="lazy" className="pointer-events-none absolute -right-24 top-0 hidden h-[720px] w-[560px] object-cover object-top opacity-45 [mask-image:linear-gradient(to_left,#000_30%,transparent),linear-gradient(to_bottom,#000_55%,transparent)] [mask-composite:intersect] lg:block" />
      <Container className="relative">
        <SectionHead
          id="h-pq"
          eyebrow="Por que o aura-fit"
          title={<>Menos operação. <span className="text-grad">Mais profissão.</span></>}
          lead="O que muda quando o repetitivo sai da sua mão: seis motivos para trocar a planilha pelo aura-fit."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {beneficios.map((b, i) => (
            <li key={b.t}>
              <BlurFade inView delay={(i % 3) * 0.08} className="h-full">
                <Tilt>
                  {b.il}
                  <div className="relative p-6 md:p-7">
                    <h3 className="text-xl font-bold tracking-tight">{b.t}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{b.d}</p>
                  </div>
                </Tilt>
              </BlurFade>
            </li>
          ))}
        </ul>
        <BlurFade inView delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Btn href="#planos">Ver os planos</Btn>
            <p className="max-w-xl text-sm leading-relaxed text-faint">Benefícios de gestão para o personal. Não prometemos resultado de saúde ou estética ao aluno, nem faturamento garantido.</p>
          </div>
        </BlurFade>
      </Container>
    </section>
  )
}
