import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

import { BarList, Bars, chartColors, Delta, LineChart, Ring } from "@/components/charts"
import { BlurFade } from "@/components/magicui/blur-fade"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { Container, SectionHead } from "@/components/ui"
import { cn } from "@/lib/utils"

/* Painel de relatórios do personal, no estilo padrão de gráficos (src/components/charts.tsx). */

const meses = ["Dez", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov"]
const receita = [2450, 2600, 2580, 2900, 3050, 3000, 3300, 3450, 3700, 3650, 3980, 4250]
const receitaAnt = [1900, 1950, 2100, 2050, 2200, 2350, 2300, 2500, 2550, 2700, 2800, 2950]
const periodos = { "6m": { l: "6 meses", n: 6 }, "12m": { l: "12 meses", n: 12 } } as const
type Periodo = keyof typeof periodos

const brl = (v: number) => `R$ ${Math.round(v).toLocaleString("pt-BR")}`
const k = (v: number) => (v >= 1000 ? `R$ ${(v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil` : `R$ ${v}`)

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-2xl border border-white/[0.07] bg-surface/80 p-4 transition-colors md:p-5 duration-300 hover:border-white/15", className)}>{children}</div>
)
const Label = ({ children }: { children: React.ReactNode }) => <p className="text-[13px] font-medium text-muted">{children}</p>

const kpis = [
  { l: "Receita do mês", v: 4250, pre: "R$ ", suf: "", d: "12,5%", good: true, down: false, spark: [3300, 3450, 3700, 3650, 3980, 4250], fmt: brl },
  { l: "Alunos ativos", v: 18, pre: "", suf: "", d: "2", good: true, down: false, spark: [13, 14, 14, 16, 16, 18], fmt: (v: number) => `${Math.round(v)} alunos` },
  { l: "Frequência média", v: 82, pre: "", suf: "%", d: "4 pts", good: true, down: false, spark: [71, 74, 73, 78, 80, 82], fmt: (v: number) => `${Math.round(v)}%` },
  { l: "Inadimplência", v: 6, pre: "", suf: "%", d: "3 pts", good: true, down: true, spark: [12, 11, 9, 9, 7, 6], fmt: (v: number) => `${Math.round(v)}%` },
]

const atencao = [
  { i: "FA", n: "Felipe Almeida", s: "7 dias sem treinar", d: [4, 4, 3, 3, 1, 0] },
  { i: "ML", n: "Marina Lopes", s: "9 dias sem treinar", d: [3, 4, 3, 2, 1, 0] },
  { i: "CN", n: "Carlos Nunes", s: "12 dias sem treinar", d: [4, 3, 2, 1, 0, 0] },
]

export function Relatorios() {
  const [per, setPer] = useState<Periodo>("12m")
  const n = periodos[per].n
  const atual = receita.slice(-n)
  const ant = receitaAnt.slice(-n)
  const total = atual.reduce((a, b) => a + b, 0)
  const cresc = ((total - ant.reduce((a, b) => a + b, 0)) / ant.reduce((a, b) => a + b, 0)) * 100

  return (
    <section id="relatorios" aria-labelledby="h-rel" className="relative py-20 md:py-28">
      <div aria-hidden="true" className="absolute left-1/2 top-64 h-[520px] w-[min(1100px,92vw)] -translate-x-1/2 rounded-full bg-primary/[0.10] blur-[140px]" />
      <Container className="relative">
        <SectionHead
          id="h-rel"
          eyebrow="Gráficos e relatórios"
          title={<>Seu negócio em números. <span className="text-grad">Sem montar planilha.</span></>}
          lead="Receita, frequência e inadimplência atualizadas sozinhas. Passe o mouse sobre os gráficos para ver cada ponto."
        />

        <BlurFade inView>
          <div className="rounded-[28px] border border-line bg-bg/80 p-3 shadow-[0_40px_120px_-40px_rgb(0_0_0/.9)] backdrop-blur md:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2 pt-1">
              <p className="text-sm"><span className="text-faint">Relatórios /</span> <span className="font-semibold text-ink">Visão geral</span></p>
              <div role="radiogroup" aria-label="Período" className="relative grid grid-cols-2 rounded-full border border-white/[0.08] bg-surface p-0.5 text-xs font-semibold">
                {(Object.keys(periodos) as Periodo[]).map((p) => (
                  <button key={p} type="button" role="radio" aria-checked={per === p} onClick={() => setPer(p)} className={cn("relative z-10 h-8 rounded-full px-4 transition-colors", per === p ? "text-white" : "text-muted hover:text-ink")}>
                    {per === p && <motion.span layoutId="rel-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                    {periodos[p].l}
                  </button>
                ))}
              </div>
            </div>

            {/* KPIs com mini-gráfico */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {kpis.map((c) => (
                <Card key={c.l}>
                  <div className="flex items-start justify-between gap-2">
                    <Label>{c.l}</Label>
                    <Delta good={c.good} down={c.down}>{c.d}</Delta>
                  </div>
                  <p className="mt-1 whitespace-nowrap text-[22px] font-bold tabular-nums tracking-tight text-ink md:text-[30px]">
                    {c.pre}<NumberTicker value={c.v} className="text-ink" />{c.suf}
                  </p>
                  <LineChart compact height={48} className="mt-2" labels={meses.slice(-6)} format={c.fmt} series={[{ name: c.l, data: c.spark, area: true, color: chartColors.main }]} />
                </Card>
              ))}
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              {/* receita: período atual x anterior */}
              <Card className="lg:col-span-2">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <Label>Receita por mês</Label>
                    <p className="mt-1 flex items-center gap-2 text-[30px] font-bold tabular-nums tracking-tight text-ink">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span key={per} initial={{ opacity: 0, y: 12, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(6px)" }} transition={{ duration: 0.3 }}>
                          {brl(total)}
                        </motion.span>
                      </AnimatePresence>
                      <Delta>{cresc.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%</Delta>
                    </p>
                  </div>
                  <ul className="flex gap-4 text-[11px] text-muted">
                    <li className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-accent" /> Este período</li>
                    <li className="flex items-center gap-1.5"><span className="h-0 w-4 border-t border-dashed border-[#8a8a8a]" /> Período anterior</li>
                  </ul>
                </div>
                <LineChart
                  key={per}
                  className="mt-4"
                  height={250}
                  labels={meses.slice(-n)}
                  format={k}
                  series={[
                    { name: "Este período", data: atual, area: true, color: chartColors.main },
                    { name: "Anterior", data: ant, dashed: true, color: chartColors.prev },
                  ]}
                />
              </Card>

              {/* de onde vem a receita */}
              <Card>
                <Label>De onde vem a receita</Label>
                <p className="mb-4 mt-1 text-[30px] font-bold tabular-nums tracking-tight text-ink">R$ 4.250</p>
                <BarList
                  format={brl}
                  items={[
                    { label: "Mensalidades presenciais", value: 2400 },
                    { label: "Consultoria online", value: 1150 },
                    { label: "Avaliações físicas", value: 420 },
                    { label: "Aulas avulsas", value: 280 },
                  ]}
                />
                <p className="mt-4 text-[11px] text-faint">Novembro · 4 fontes</p>
              </Card>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              <Card>
                <div className="flex items-start justify-between">
                  <Label>Treinos concluídos por dia</Label>
                  <Delta>9%</Delta>
                </div>
                <p className="mb-4 mt-1 text-[30px] font-bold tabular-nums tracking-tight text-ink">74 <span className="text-sm font-medium text-muted">esta semana</span></p>
                <Bars data={[14, 12, 15, 11, 13, 6, 3]} labels={["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]} format={(v) => `${v} treinos`} accentFrom={0} height={130} />
              </Card>

              <Card>
                <Label>Alunos que precisam de atenção</Label>
                <ul className="mt-3 divide-y divide-white/[0.07]">
                  {atencao.map((a) => (
                    <li key={a.n} className="flex items-center gap-3 py-2.5">
                      <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[11px] font-bold text-muted">{a.i}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-ink">{a.n}</span>
                        <span className="block text-[11px] text-warn">{a.s}</span>
                      </span>
                      <LineChart compact height={34} className="w-20 shrink-0" labels={["S1", "S2", "S3", "S4", "S5", "S6"]} format={(v) => `${Math.round(v)} treinos`} series={[{ name: a.n, data: [...a.d], color: chartColors.warn, area: true }]} />
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] text-faint">Treinos por semana, últimas 6 semanas</p>
              </Card>

              <Card className="flex flex-col">
                <Label>Cobranças de novembro</Label>
                <div className="flex flex-1 items-center gap-5 pt-3">
                  <Ring value={0.94} label="em dia" sub="17 de 18" />
                  <ul className="flex-1 space-y-2.5 text-[13px]">
                    {[["Pagas", "17", "bg-accent"], ["Lembrete enviado", "1", "bg-warn"], ["Atrasadas", "0", "bg-white/20"]].map(([l, v, c]) => (
                      <li key={l} className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-muted"><span className={cn("size-2 rounded-full", c)} /> {l}</span>
                        <span className="font-semibold tabular-nums text-ink">{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-2 text-[11px] text-faint">Passe o mouse no anel para ver o total</p>
              </Card>
            </div>
          </div>
        </BlurFade>
      </Container>
    </section>
  )
}
