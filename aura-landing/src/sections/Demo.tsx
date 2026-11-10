import { Check, MousePointerClick, RotateCcw } from "lucide-react"
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { useRef, useState } from "react"

import { BlurFade } from "@/components/magicui/blur-fade"
import { Container, SectionHead } from "@/components/ui"
import { cn } from "@/lib/utils"

/* Fluxo interativo sobre capturas reais do app (_evidence/, 390×844).
   Cada ponto clicável é um retângulo em px da captura; "to" leva a outra tela. */
const W = 390
const H = 844

type Spot = { id: string; x: number; y: number; w: number; h: number; label: string; to?: string }
type Screen = { id: string; img: string; alt: string; step: string; text: string; spots: Spot[] }
type Flow = { id: string; tab: string; title: string; screens: Screen[] }

const flows: Flow[] = [
  {
    id: "personal",
    tab: "Personal: montar o treino",
    title: "Como o treino é feito",
    screens: [
      {
        id: "treinos",
        img: "./img/fluxo-p1-treinos.png",
        alt: "Tela Treinos do personal: botão Novo modelo, filtros e lista de 7 modelos de treino.",
        step: "Biblioteca de modelos",
        text: "Seus modelos de treino ficam num lugar só. Comece um novo ou reaproveite um que já funciona.",
        spots: [
          { id: "novo", x: 16, y: 162, w: 124, h: 44, label: "Criar um modelo de treino", to: "modelo" },
          { id: "lista", x: 16, y: 655, w: 358, h: 150, label: "Modelos prontos para atribuir a alunos" },
        ],
      },
      {
        id: "modelo",
        img: "./img/fluxo-p2-modelo.png",
        alt: "Tela do editor de modelo Adaptação inicial: dados do modelo e botões Salvar rascunho, Publicar versão, Atribuir, Histórico e Fechar.",
        step: "Monte o modelo",
        text: "Dê nome, objetivo, sessões e exercícios. Salve como rascunho e, quando estiver pronto, atribua a um aluno.",
        spots: [
          { id: "salvar", x: 28, y: 552, w: 334, h: 44, label: "Rascunho salvo, nada vai ao aluno ainda" },
          { id: "atribuir", x: 28, y: 664, w: 334, h: 44, label: "Atribuir o modelo a um aluno", to: "aluno" },
        ],
      },
      {
        id: "aluno",
        img: "./img/fluxo-p3-aluno.png",
        alt: "Tela de detalhe da aluna Marina Lopes: treino atual Hipertrofia A/B, 2 de 3 sessões da semana e última sessão concluída há 2 dias.",
        step: "O treino no aluno",
        text: "No perfil do aluno você vê o treino atual, as sessões da semana e a última execução.",
        spots: [
          { id: "treino", x: 16, y: 470, w: 358, h: 176, label: "Abrir o treino deste aluno para ajustar", to: "editor" },
          { id: "sessao", x: 16, y: 664, w: 358, h: 146, label: "Última sessão registrada pelo aluno" },
        ],
      },
      {
        id: "editor",
        img: "./img/fluxo-p4-editor.png",
        alt: "Tela Treino de Marina Lopes: aviso de que o aluno vê os ajustes salvos e botões Salvar ajustes, Pausar treino, Encerrar treino e Ver histórico.",
        step: "Ajuste e salve",
        text: "Ajuste só o treino deste aluno, sem mexer no modelo. O aluno vê o que você salvar.",
        spots: [
          { id: "aviso", x: 16, y: 330, w: 358, h: 48, label: "O aluno só vê o que você salvar" },
          { id: "salvar", x: 28, y: 516, w: 334, h: 44, label: "Salvar e ver como o aluno recebe", to: "@aluno" },
        ],
      },
    ],
  },
  {
    id: "aluno",
    tab: "Aluno: ver o treino",
    title: "Como o aluno vê o treino",
    screens: [
      {
        id: "inicio",
        img: "./img/tela-aluno-inicio.png",
        alt: "Tela inicial do aluno: treino de hoje (Treino A: Superior, 45 minutos, 5 exercícios), botão Ver treino e sequência de 3 semanas ativas.",
        step: "Início do aluno",
        text: "O aluno abre o app e o treino de hoje já está no topo, com a sequência da semana logo abaixo.",
        spots: [
          { id: "ver", x: 38, y: 306, w: 314, h: 52, label: "Abrir o treino de hoje", to: "treino" },
          { id: "seq", x: 16, y: 404, w: 358, h: 190, label: "Sequência: treino feito e descanso contam" },
          { id: "nav", x: 130, y: 780, w: 130, h: 64, label: "Aba Treino", to: "treino" },
        ],
      },
      {
        id: "treino",
        img: "./img/tela-aluno-treino.png",
        alt: "Tela Treino de hoje do aluno: Treino A Superior, cerca de 45 minutos, com séries, repetições e descanso de supino reto, remada curvada e desenvolvimento com halteres.",
        step: "Treino de hoje",
        text: "Cada exercício mostra séries, repetições e descanso, na ordem que você definiu.",
        spots: [
          { id: "voltar", x: 16, y: 94, w: 150, h: 32, label: "Voltar ao início", to: "inicio" },
          { id: "cuide", x: 16, y: 218, w: 358, h: 146, label: "Aviso de cuidado antes de treinar" },
          { id: "ex1", x: 16, y: 420, w: 358, h: 116, label: "Séries, repetições e descanso do exercício" },
          { id: "nav", x: 0, y: 780, w: 130, h: 64, label: "Aba Início", to: "inicio" },
        ],
      },
    ],
  },
]

function Hotspot({ s, mouse, onGo }: { s: Spot; mouse: { x: number; y: number } | null; onGo: (to: string) => void }) {
  const [hover, setHover] = useState(false)
  // proximidade do cursor ao centro do ponto (0 longe, 1 em cima), em px da captura
  let near = 0
  if (mouse) {
    const dx = Math.max(s.x - mouse.x, 0, mouse.x - (s.x + s.w))
    const dy = Math.max(s.y - mouse.y, 0, mouse.y - (s.y + s.h))
    near = Math.max(0, 1 - Math.hypot(dx, dy) / 150)
  }
  const nav = Boolean(s.to)
  const below = s.y < 150
  const Tag = nav ? "button" : "div"
  return (
    <Tag
      {...(nav ? { type: "button" as const, onClick: () => onGo(s.to!), "aria-label": s.label } : { tabIndex: 0, role: "note", "aria-label": s.label })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={cn("group absolute rounded-xl outline-offset-2", nav ? "cursor-pointer" : "cursor-help")}
      style={{ left: `${(s.x / W) * 100}%`, top: `${(s.y / H) * 100}%`, width: `${(s.w / W) * 100}%`, height: `${(s.h / H) * 100}%` }}
    >
      {/* realce da área: acende conforme o cursor se aproxima */}
      <span
        aria-hidden="true"
        className={cn("absolute -inset-1 rounded-xl border-2 transition-[opacity,transform] duration-200", nav ? "border-[#b1111b] bg-[#b1111b]/10" : "border-[#2563eb] bg-[#2563eb]/10")}
        style={{ opacity: hover ? 1 : near * 0.9, transform: `scale(${1 + (hover ? 0.02 : 0)})` }}
      />
      {/* marcador pulsante */}
      <span aria-hidden="true" className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center" style={{ transform: `scale(${1 + near * 0.8})` }}>
        <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-70", nav ? "bg-[#d0202b]" : "bg-[#2563eb]")} />
        <span className={cn("relative inline-flex size-3 rounded-full border-2 border-white shadow", nav ? "bg-[#d0202b]" : "bg-[#2563eb]")} />
      </span>
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: below ? -6 : 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={cn("pointer-events-none absolute z-20 w-max max-w-[200px] rounded-lg", s.x < 60 ? "left-0" : s.x + s.w > W - 60 ? "right-0" : "left-1/2 -translate-x-1/2", " bg-[#141414] px-2.5 py-1.5 text-center text-[11px] font-medium leading-snug text-white shadow-xl", below ? "top-full mt-2" : "bottom-full mb-2")}
          >
            {s.label}
            {nav && <span className="mt-0.5 block text-[10px] font-normal text-[#ff9aa0]">clique para seguir</span>}
          </motion.span>
        )}
      </AnimatePresence>
    </Tag>
  )
}

export function Demo() {
  const [flowId, setFlowId] = useState("personal")
  const [screenId, setScreenId] = useState("treinos")
  const [seen, setSeen] = useState<string[]>(["personal:treinos"])
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null)
  const shot = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  const flow = flows.find((f) => f.id === flowId)!
  const screen = flow.screens.find((s) => s.id === screenId)!
  const idx = flow.screens.indexOf(screen)

  // inclinação do aparelho seguindo o cursor
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-1, 1], [7, -7]), { stiffness: 140, damping: 18 })
  const ry = useSpring(useTransform(mx, [-1, 1], [-10, 10]), { stiffness: 140, damping: 18 })

  const go = (fId: string, sId: string) => {
    setFlowId(fId)
    setScreenId(sId)
    setSeen((v) => (v.includes(`${fId}:${sId}`) ? v : [...v, `${fId}:${sId}`]))
  }
  const onGo = (to: string) => {
    if (to.startsWith("@")) {
      const f = flows.find((x) => x.id === to.slice(1))!
      go(f.id, f.screens[0].id)
    } else go(flowId, to)
  }
  const onMove = (e: React.MouseEvent) => {
    const st = stage.current?.getBoundingClientRect()
    if (st) {
      mx.set(((e.clientX - st.left) / st.width) * 2 - 1)
      my.set(((e.clientY - st.top) / st.height) * 2 - 1)
    }
    const r = shot.current?.getBoundingClientRect()
    if (r) setMouse({ x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H })
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
    setMouse(null)
  }

  return (
    <section id="telas" aria-labelledby="h-telas" className="relative overflow-x-clip border-y border-line bg-surface/40 py-20 md:py-28">
      <Container>
        <SectionHead
          id="h-telas"
          eyebrow="Experimente"
          title={<>Clique e veja o treino <span className="text-grad">nascer e chegar ao aluno.</span></>}
          lead="Capturas reais do app em desenvolvimento, com dados de exemplo [MOCK]. Passe o mouse pelas áreas marcadas e clique nos pontos vermelhos para seguir o fluxo."
        />

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <BlurFade inView>
            <div role="tablist" aria-label="Fluxo" className="relative mb-8 inline-grid w-full max-w-lg grid-cols-2 rounded-full border border-line bg-surface p-1">
              {flows.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={flowId === f.id}
                  onClick={() => go(f.id, f.screens[0].id)}
                  className={cn("relative z-10 h-11 rounded-full px-3 text-[13px] font-semibold transition-colors sm:text-sm", flowId === f.id ? "text-white" : "text-muted hover:text-ink")}
                >
                  {flowId === f.id && <motion.span layoutId="flow-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  {f.tab}
                </button>
              ))}
            </div>

            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">{flow.title}</h3>
            <ol className="mt-6 space-y-2">
              {flow.screens.map((s, i) => {
                const on = s.id === screenId
                const done = seen.includes(`${flow.id}:${s.id}`) && !on
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => go(flow.id, s.id)}
                      aria-current={on ? "step" : undefined}
                      className={cn("flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors", on ? "border-primary-line bg-primary-soft/50" : "border-transparent hover:bg-white/[0.04]")}
                    >
                      <span className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors", on ? "bg-primary text-white" : done ? "bg-ok/15 text-ok" : "bg-surface-2 text-muted")}>
                        {done ? <Check size={16} /> : i + 1}
                      </span>
                      <span>
                        <span className={cn("block font-semibold tracking-tight", on ? "text-ink" : "text-muted")}>{s.step}</span>
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.span
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="block overflow-hidden text-sm leading-relaxed text-muted"
                            >
                              <span className="block pt-1">{s.text}</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-faint">
              <span className="inline-flex items-center gap-2"><span className="size-2.5 rounded-full bg-primary" /> ponto vermelho: clique para avançar</span>
              <span className="inline-flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#2563eb]" /> ponto azul: passe o mouse</span>
              <button type="button" onClick={() => { setSeen([`${flow.id}:${flow.screens[0].id}`]); setScreenId(flow.screens[0].id) }} className="inline-flex h-9 items-center gap-1.5 rounded-full px-2 font-medium text-muted hover:text-ink">
                <RotateCcw size={14} /> Recomeçar
              </button>
            </div>
          </BlurFade>

          {/* aparelho interativo */}
          <div ref={stage} onMouseMove={onMove} onMouseLeave={onLeave} className="relative flex justify-center py-6 [perspective:1400px]">
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 size-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[120px]" />
            <motion.div aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute left-1/2 top-1/2 -ml-[250px] -mt-[250px] hidden size-[500px] rounded-full border border-dashed border-white/10 sm:block" />
            <motion.div style={{ rotateX: rx, rotateY: ry }} className="relative w-[min(100%,310px,38svh)] rounded-[46px] border border-white/15 bg-[#0b0b0d] p-[9px] shadow-[0_40px_80px_-20px_rgb(0_0_0/.85),inset_0_0_0_2px_#3a3a42]">
              <div className="overflow-hidden rounded-[37px] bg-white">
                <div aria-hidden="true" className="flex h-8 items-center justify-center">
                  <span className="h-[18px] w-[84px] rounded-full bg-black" />
                </div>
                <div ref={shot} className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.img
                      key={`${flow.id}:${screen.id}`}
                      src={screen.img}
                      alt={screen.alt}
                      width={W}
                      height={H}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 block size-full"
                    />
                  </AnimatePresence>
                  {screen.spots.map((s) => (
                    <Hotspot key={`${flow.id}:${screen.id}:${s.id}`} s={s} mouse={mouse} onGo={onGo} />
                  ))}
                </div>
              </div>
            </motion.div>
            <p className="absolute -bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-xs text-faint">
              <MousePointerClick size={14} /> Tela {idx + 1} de {flow.screens.length} · demonstração, nada é gravado
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
