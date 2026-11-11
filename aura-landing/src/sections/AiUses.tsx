import { useEffect, useRef, type ReactNode } from "react"

import { BlurFade } from "@/components/magicui/blur-fade"
import { MagicCard } from "@/components/magicui/magic-card"
import { Container, SectionHead } from "@/components/ui"

/* Ilustrações SVG animadas (SMIL) dos usos da IA. Cores e tipografia da marca.
   Cada cena roda num laço de DUR segundos; <Show> acende um grupo num trecho do laço. */
const DUR = "9s"
const C = { bg: "#141414", card: "#1f1f1f", card2: "#2a2a2a", line: "#3a3a3a", ink: "#f5f5f5", muted: "#b0b0b0", faint: "#8a8a8a", red: "#d0202b", brand: "#b1111b", accent: "#ff6f78", ok: "#52d88a", warn: "#f1b93a" }

function Show({ from, to = 0.96, children, dy = 6 }: { from: number; to?: number; children: ReactNode; dy?: number }) {
  const a = Math.max(from - 0.04, 0)
  const kt = `0;${a};${from};${to};${Math.min(to + 0.03, 1)};1`
  return (
    <g opacity="0">
      <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes={kt} dur={DUR} repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="translate" values={`0 ${dy};0 ${dy};0 0;0 0;0 0;0 0`} keyTimes={kt} dur={DUR} repeatCount="indefinite" />
      {children}
    </g>
  )
}

function Scene({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    // quem prefere menos movimento vê o quadro final parado
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      svg.setCurrentTime(8.4)
      svg.pauseAnimations()
      return
    }
    // só anima enquanto está na tela
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()), { threshold: 0.15 })
    io.observe(svg)
    return () => io.disconnect()
  }, [])
  return (
    <svg ref={ref} viewBox="0 0 400 250" role="img" aria-label={label} className="block h-auto w-full" fontFamily="Inter Variable, Inter, system-ui, sans-serif">
      <rect width="400" height="250" rx="18" fill={C.bg} />
      {children}
    </svg>
  )
}

const T = ({ x, y, children, size = 10, fill = C.ink, weight = 500, anchor }: { x: number; y: number; children: ReactNode; size?: number; fill?: string; weight?: number; anchor?: "middle" | "end" }) => (
  <text x={x} y={y} fontSize={size} fill={fill} fontWeight={weight} textAnchor={anchor}>{children}</text>
)

/* 1 · Dúvidas de treino (chat) */
function SvgDuvidas() {
  return (
    <Scene label="Animação: o aluno pergunta como fazer o stiff sem forçar a lombar, a IA responde em linguagem simples e o personal é avisado.">
      <rect x="20" y="16" width="360" height="26" rx="13" fill={C.card} />
      <circle cx="36" cy="29" r="6" fill="none" stroke={C.red} strokeWidth="2" /><circle cx="36" cy="29" r="2.2" fill={C.red} />
      <T x={50} y={33} size={11} weight={700}>aura I.A · dúvidas de treino</T>

      <Show from={0.05}>
        <rect x="150" y="54" width="230" height="40" rx="14" fill={C.red} />
        <T x={164} y={71} fill="#fff">Como faço o stiff sem forçar</T>
        <T x={164} y={85} fill="#fff">a lombar?</T>
      </Show>

      {/* digitando */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.17;0.2;0.34;0.37;1" dur={DUR} repeatCount="indefinite" />
        <rect x="20" y="106" width="58" height="28" rx="14" fill={C.card2} />
        {[36, 49, 62].map((cx, i) => (
          <circle key={cx} cx={cx} cy="120" r="3.2" fill={C.muted}>
            <animate attributeName="cy" values="120;115;120" dur="0.9s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>

      <Show from={0.38}>
        <rect x="20" y="106" width="270" height="84" rx="14" fill={C.card2} />
        <T x={34} y={124} weight={700}>3 pontos para o stiff:</T>
        <T x={34} y={141} fill={C.muted}>1. Joelhos levemente flexionados</T>
        <T x={34} y={156} fill={C.muted}>2. Coluna neutra, quadril para trás</T>
        <T x={34} y={171} fill={C.muted}>3. Barra perto das pernas</T>
        <T x={34} y={184} size={8} fill={C.faint}>Sentiu dor? Pare e avise seu personal.</T>
      </Show>

      <Show from={0.66}>
        <rect x="20" y="202" width="210" height="28" rx="14" fill="none" stroke={C.ok} strokeOpacity=".5" />
        <path d="M34 216l4 4 8-9" fill="none" stroke={C.ok} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <T x={54} y={220} fill={C.ok}>Dúvida registrada para o personal</T>
      </Show>
    </Scene>
  )
}

/* 2 · Análise de vídeo do movimento */
function SvgVideo() {
  // esqueleto: em pé (a) ↔ agachado (b), laço de 3s
  const k = "0;0.45;0.6;1"
  const an = (attr: string, a: number, b: number) => <animate attributeName={attr} values={`${a};${b};${b};${a}`} keyTimes={k} dur="3s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .2 1;0 0 1 1;.4 0 .2 1" />
  const P = { ankle: [112, 204], knee: [[112, 162], [134, 166]], hip: [[112, 122], [90, 160]], sh: [[112, 74], [112, 116]], head: [[112, 58], [118, 100]], hand: [[146, 84], [152, 122]] } as const
  const bone = (p: readonly (readonly number[])[], q: readonly (readonly number[])[]) => (
    <line x1={p[0][0]} y1={p[0][1]} x2={q[0][0]} y2={q[0][1]} stroke={C.ink} strokeWidth="5" strokeLinecap="round">
      {an("x1", p[0][0], p[1][0])}{an("y1", p[0][1], p[1][1])}{an("x2", q[0][0], q[1][0])}{an("y2", q[0][1], q[1][1])}
    </line>
  )
  const joint = (p: readonly (readonly number[])[], color: string = C.accent) => (
    <circle cx={p[0][0]} cy={p[0][1]} r="5" fill={C.bg} stroke={color} strokeWidth="2.5">{an("cx", p[0][0], p[1][0])}{an("cy", p[0][1], p[1][1])}</circle>
  )
  return (
    <Scene label="Animação: vídeo de um agachamento com os pontos das articulações marcados quadro a quadro, ângulo do joelho medido e uma lista de observações para o personal revisar.">
      {/* quadro do vídeo */}
      <rect x="20" y="20" width="184" height="210" rx="14" fill={C.card} />
      <clipPath id="vclip"><rect x="20" y="20" width="184" height="210" rx="14" /></clipPath>
      <g clipPath="url(#vclip)">
        <line x1="20" y1="208" x2="204" y2="208" stroke={C.line} strokeWidth="2" />
        <rect x="20" y="20" width="184" height="26" fill={C.red} opacity=".14">
          <animate attributeName="y" values="20;204;20" dur="4s" repeatCount="indefinite" />
        </rect>
        <line x1="20" x2="204" y1="20" y2="20" stroke={C.accent} strokeWidth="1.5">
          <animate attributeName="y1" values="20;230;20" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="20;230;20" dur="4s" repeatCount="indefinite" />
        </line>
      </g>
      {/* figura */}
      <line x1={P.ankle[0]} y1={P.ankle[1]} x2={P.knee[0][0]} y2={P.knee[0][1]} stroke={C.ink} strokeWidth="5" strokeLinecap="round">{an("x2", P.knee[0][0], P.knee[1][0])}{an("y2", P.knee[0][1], P.knee[1][1])}</line>
      <line x1={P.ankle[0] - 8} y1={P.ankle[1] + 2} x2={P.ankle[0] + 22} y2={P.ankle[1] + 2} stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
      {bone(P.knee, P.hip)}{bone(P.hip, P.sh)}{bone(P.sh, P.hand)}
      <circle cx={P.head[0][0]} cy={P.head[0][1]} r="11" fill={C.ink}>{an("cx", P.head[0][0], P.head[1][0])}{an("cy", P.head[0][1], P.head[1][1])}</circle>
      {joint(P.sh)}{joint(P.hip)}{joint(P.knee, C.warn)}
      <circle cx={P.ankle[0]} cy={P.ankle[1]} r="5" fill={C.bg} stroke={C.accent} strokeWidth="2.5" />
      {/* ângulo do joelho, aparece no fundo do agachamento */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.4;0.47;0.6;0.7" dur="3s" repeatCount="indefinite" />
        <rect x="142" y="170" width="54" height="20" rx="10" fill={C.warn} />
        <T x={169} y={184} size={10} fill="#141414" weight={700} anchor="middle">joelho 88°</T>
      </g>
      <rect x="30" y="30" width="62" height="18" rx="9" fill="#000" opacity=".55" />
      <circle cx="40" cy="39" r="3" fill={C.red}><animate attributeName="opacity" values="1;.2;1" dur="1.2s" repeatCount="indefinite" /></circle>
      <T x={48} y={43} size={9}>quadro a quadro</T>

      {/* painel de análise */}
      <T x={220} y={36} size={11} weight={700}>Análise do movimento</T>
      <T x={220} y={50} size={8.5} fill={C.faint}>Agachamento · 12 repetições</T>
      {[
        { y: 62, f: 0.12, t: "Profundidade", s: "abaixo do paralelo", c: C.ok, ok: true },
        { y: 104, f: 0.3, t: "Coluna", s: "neutra em 11 de 12", c: C.ok, ok: true },
        { y: 146, f: 0.48, t: "Joelhos", s: "entram na subida (rep. 9)", c: C.warn, ok: false },
      ].map((r) => (
        <Show key={r.t} from={r.f}>
          <rect x="220" y={r.y} width="160" height="36" rx="10" fill={C.card} />
          <circle cx="236" cy={r.y + 18} r="8" fill={r.c} opacity=".18" />
          {r.ok ? <path d={`M232 ${r.y + 18}l3 3 5-6`} fill="none" stroke={r.c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> : <T x={236} y={r.y + 22} size={11} fill={r.c} weight={800} anchor="middle">!</T>}
          <T x={252} y={r.y + 15} weight={700}>{r.t}</T>
          <T x={252} y={r.y + 28} size={8.5} fill={C.muted}>{r.s}</T>
        </Show>
      ))}
      <Show from={0.66}>
        <rect x="220" y="192" width="160" height="38" rx="10" fill={C.red} />
        <T x={300} y={208} fill="#fff" weight={700} anchor="middle">Enviar ao personal</T>
        <T x={300} y={221} size={8} fill="#ffd9dc" anchor="middle">ele revisa antes de orientar</T>
      </Show>
    </Scene>
  )
}

/* 3 · Relatos de dor e exames → resumo para o personal */
function SvgSaude() {
  return (
    <Scene label="Animação: o aluno relata dor lombar e anexa um exame; a IA organiza um resumo para o personal, com sugestão de atenção e sem diagnóstico.">
      {/* relato */}
      <rect x="20" y="20" width="150" height="210" rx="14" fill={C.card} />
      <T x={34} y={40} size={10} weight={700}>Relato do aluno</T>
      {/* silhueta */}
      <g stroke={C.muted} strokeWidth="5" strokeLinecap="round" fill="none">
        <circle cx="62" cy="68" r="9" fill={C.muted} stroke="none" />
        <path d="M62 82v46M62 90l-16 22M62 90l16 22M62 128l-12 34M62 128l12 34" />
      </g>
      <circle cx="62" cy="118" r="6" fill={C.red}>
        <animate attributeName="r" values="5;11;5" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".9;.25;.9" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="62" cy="118" r="4" fill={C.red} />
      <Show from={0.06}>
        <rect x="88" y="100" width="72" height="34" rx="9" fill={C.card2} />
        <T x={96} y={114} size={8.5} weight={700}>Dor na lombar</T>
        <T x={96} y={126} size={8} fill={C.muted}>nível 6 de 10</T>
      </Show>
      <Show from={0.18}>
        <rect x="32" y="176" width="126" height="20" rx="6" fill={C.card2} />
        <path d="M40 181h8l3 3v8h-11z" fill="none" stroke={C.accent} strokeWidth="1.4" />
        <T x={58} y={190} size={8.5}>exame-sangue.pdf</T>
      </Show>
      <Show from={0.26}>
        <rect x="32" y="200" width="126" height="20" rx="6" fill={C.card2} />
        <path d="M40 205h8l3 3v8h-11z" fill="none" stroke={C.accent} strokeWidth="1.4" />
        <T x={58} y={214} size={8.5}>plano-nutricional.pdf</T>
      </Show>

      {/* fluxo para a IA */}
      <path id="flow3" d="M170 125 H 214" stroke={C.line} strokeWidth="2" strokeDasharray="3 5" fill="none" />
      {[0, 0.6, 1.2].map((b) => (
        <circle key={b} r="3" fill={C.accent}><animateMotion dur="1.8s" begin={`${b}s`} repeatCount="indefinite"><mpath href="#flow3" /></animateMotion></circle>
      ))}

      {/* resumo */}
      <rect x="214" y="20" width="166" height="210" rx="14" fill={C.card} stroke={C.brand} />
      <T x={228} y={40} size={10} weight={700}>Resumo para o personal</T>
      <T x={228} y={53} size={8} fill={C.faint}>gerado pela IA · você revisa</T>
      {[
        { y: 64, f: 0.36, c: C.warn, a: "Dor lombar relatada", b: "2 vezes nesta semana" },
        { y: 104, f: 0.5, c: C.accent, a: "Ponto de atenção", b: "rever carga do stiff" },
        { y: 144, f: 0.64, c: C.ok, a: "Exames anexados", b: "leitura organizada, sem laudo" },
      ].map((r) => (
        <Show key={r.a} from={r.f}>
          <rect x="226" y={r.y} width="142" height="34" rx="9" fill={C.card2} />
          <rect x="226" y={r.y} width="4" height="34" rx="2" fill={r.c} />
          <T x={238} y={r.y + 14} size={9} weight={700}>{r.a}</T>
          <T x={238} y={r.y + 26} size={8} fill={C.muted}>{r.b}</T>
        </Show>
      ))}
      <Show from={0.76}>
        <rect x="226" y="188" width="142" height="30" rx="9" fill="none" stroke={C.line} />
        <path d="M238 197l5-2 5 2v5c0 4-5 7-5 7s-5-3-5-7z" fill="none" stroke={C.ok} strokeWidth="1.4" />
        <T x={254} y={201} size={8} fill={C.muted}>Só com consentimento</T>
        <T x={254} y={211} size={8} fill={C.muted}>do aluno. Não é diagnóstico.</T>
      </Show>
    </Scene>
  )
}

/* 4 · Importar qualquer documento de texto → treino preenchido */
function SvgImportar() {
  const rows = [
    { n: "Agachamento livre", s: "4 × 10", f: 0.3, ok: true },
    { n: "Leg press 45°", s: "3 × 12", f: 0.4, ok: true },
    { n: "Cadeira extensora", s: "3 × 15", f: 0.5, ok: true },
    { n: "“panturrilha no smith?”", s: "confirmar", f: 0.6, ok: false },
  ]
  return (
    <Scene label="Animação: um documento de texto com um treino escrito é lido pela IA e vira uma lista de exercícios com séries e repetições; as linhas ambíguas ficam para o personal confirmar.">
      {/* documento */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="4s" repeatCount="indefinite" />
        <path d="M28 28h74l22 22v152a8 8 0 0 1-8 8H28a8 8 0 0 1-8-8V36a8 8 0 0 1 8-8z" fill={C.card} stroke={C.line} />
        <path d="M102 28v22h22" fill="none" stroke={C.line} />
        <T x={32} y={48} size={9} weight={700}>treino-marina.txt</T>
        {[62, 76, 90, 104, 118, 132, 146, 160].map((y, i) => (
          <rect key={y} x="32" y={y} width={[78, 64, 82, 50, 74, 60, 80, 44][i]} height="5" rx="2.5" fill={C.line} />
        ))}
        {/* linha sendo lida */}
        <rect x="28" y="59" width="90" height="11" rx="3" fill={C.red} opacity=".28">
          <animate attributeName="y" values="59;59;73;87;101;115;157;157" keyTimes="0;0.24;0.3;0.4;0.5;0.6;0.7;1" dur={DUR} repeatCount="indefinite" />
        </rect>
        <rect x="32" y="182" width="24" height="14" rx="4" fill={C.card2} /><T x={44} y={192} size={7} fill={C.muted} anchor="middle">.txt</T>
        <rect x="60" y="182" width="24" height="14" rx="4" fill={C.card2} /><T x={72} y={192} size={7} fill={C.muted} anchor="middle">.pdf</T>
        <rect x="88" y="182" width="28" height="14" rx="4" fill={C.card2} /><T x={102} y={192} size={7} fill={C.muted} anchor="middle">.docx</T>
      </g>

      {/* IA no meio */}
      <path id="flow4" d="M128 120 C 150 120, 150 120, 176 120" stroke={C.line} strokeWidth="2" strokeDasharray="3 5" fill="none" />
      {[0, 0.5, 1].map((b) => (
        <circle key={b} r="3" fill={C.accent}><animateMotion dur="1.5s" begin={`${b}s`} repeatCount="indefinite"><mpath href="#flow4" /></animateMotion></circle>
      ))}
      <g>
        <circle cx="152" cy="120" r="15" fill={C.bg} stroke={C.red} strokeWidth="2" />
        <path d="M152 110l2.6 6.4 6.4 2.6-6.4 2.6-2.6 6.4-2.6-6.4-6.4-2.6 6.4-2.6z" fill={C.accent}>
          <animateTransform attributeName="transform" type="rotate" values="0 152 119;180 152 119;360 152 119" dur="5s" repeatCount="indefinite" />
        </path>
      </g>

      {/* treino preenchido */}
      <rect x="180" y="20" width="200" height="210" rx="14" fill={C.card} />
      <T x={194} y={40} size={10} weight={700}>Treino A · Inferiores</T>
      <T x={194} y={53} size={8} fill={C.faint}>preenchido pela IA · revisão linha a linha</T>
      {rows.map((r, i) => (
        <Show key={r.n} from={r.f}>
          <rect x="192" y={62 + i * 30} width="176" height="24" rx="8" fill={C.card2} stroke={r.ok ? "none" : C.warn} strokeDasharray={r.ok ? undefined : "3 3"} />
          <T x={202} y={78 + i * 30} size={9} fill={r.ok ? C.ink : C.warn}>{r.n}</T>
          <T x={360} y={78 + i * 30} size={9} fill={r.ok ? C.muted : C.warn} weight={700} anchor="end">{r.s}</T>
        </Show>
      ))}
      <Show from={0.7}>
        <T x={194} y={196} size={8} fill={C.muted}>3 reconhecidas · 1 para confirmar</T>
        <rect x="192" y="202" width="176" height="20" rx="8" fill={C.red} />
        <T x={280} y={216} size={9} fill="#fff" weight={700} anchor="middle">Levar ao editor</T>
      </Show>
    </Scene>
  )
}

const usos = [
  { tag: "Aluno", t: "Tirar dúvidas de treino", d: "O aluno pergunta como executar um exercício e recebe uma explicação simples. A dúvida fica registrada para você.", svg: <SvgDuvidas />, st: "Em avaliação" },
  { tag: "Aluno e personal", t: "Vídeo do movimento analisado", d: "O aluno grava a execução e a IA marca articulações, ângulos e repetições, quadro a quadro. Você recebe os pontos de atenção e decide a orientação.", svg: <SvgVideo />, st: "Em avaliação" },
  { tag: "Personal", t: "Relatos de dor e exames, organizados", d: "Queixas de dor e exames médicos ou nutricionais que o aluno liberar viram um resumo para você acompanhar. A IA organiza, não diagnostica.", svg: <SvgSaude />, st: "Em avaliação · só com consentimento do aluno" },
  { tag: "Personal", t: "Treino preenchido a partir de um documento", d: "Exporte qualquer documento de texto com o treino. A IA lê, preenche exercícios, séries e repetições, e deixa o que for ambíguo para você confirmar.", svg: <SvgImportar />, st: "A IA só sugere. Nada é salvo até você revisar." },
]

export function AiUses() {
  return (
    <section id="ia" aria-labelledby="h-ia" className="relative py-20 md:py-28">
      <Container>
        <SectionHead
          id="h-ia"
          eyebrow="IA no aura-fit"
          title={<>Onde a IA entra. <span className="text-grad">E onde ela para.</span></>}
          lead="Quatro usos, ilustrados. Em todos, a IA sugere e organiza: quem decide é o personal."
        />
        <ul className="grid gap-4 md:grid-cols-2">
          {usos.map((u, i) => (
            <li key={u.t}>
              <BlurFade inView delay={(i % 2) * 0.1} className="h-full">
                <MagicCard gradientColor="#3a1216" gradientFrom="#ff6f78" gradientTo="#b1111b" gradientOpacity={0.5} gradientSize={260} className="h-full rounded-3xl">
                  <article className="flex h-full flex-col p-4 md:p-5">
                    <div className="overflow-hidden rounded-2xl border border-line">{u.svg}</div>
                    <div className="flex flex-1 flex-col p-3 pt-6 md:p-4 md:pt-7">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{u.tag}</p>
                      <h3 className="mt-2 text-2xl font-bold tracking-tight">{u.t}</h3>
                      <p className="mt-3 flex-1 leading-relaxed text-muted">{u.d}</p>
                      <p className="mt-4 text-[13px] text-faint">{u.st}</p>
                    </div>
                  </article>
                </MagicCard>
              </BlurFade>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-faint">
          O aura-fit não substitui a orientação de um profissional de saúde. Dados de saúde, fotos e vídeos só seguiriam para recursos de IA com o consentimento do aluno.
        </p>
      </Container>
    </section>
  )
}
