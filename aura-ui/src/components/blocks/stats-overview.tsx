"use client"

import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { KpiChart } from "@/components/ui/kpi-chart"
import { ChartCard } from "@/components/ui/chart-card"
import { BarsChart } from "@/components/ui/bars-chart"
import {
  CollaborationStream,
  type CollaborationEvent,
} from "@/components/ui/collaboration-stream"

/* KPIs do topo — valor já formatado, variação e uma linha de tendência curta. */
const KPIS = [
  {
    label: "Receita",
    value: "R$ 48,2k",
    delta: "+12% no mês",
    trend: "up" as const,
    data: [28, 31, 30, 35, 38, 42, 44, 48],
  },
  {
    label: "Alunos ativos",
    value: 312,
    delta: "+24 na semana",
    trend: "up" as const,
    data: [240, 255, 268, 274, 283, 295, 304, 312],
  },
  {
    label: "Treinos/semana",
    value: "1.284",
    delta: "+6% vs. anterior",
    trend: "up" as const,
    data: [980, 1020, 1075, 1110, 1160, 1205, 1240, 1284],
  },
  {
    label: "Churn",
    value: "2,1%",
    delta: "-0,4 pp no mês",
    trend: "down" as const,
    data: [3.4, 3.1, 2.9, 2.8, 2.6, 2.4, 2.3, 2.1],
  },
]

/* Treinos registrados por mês — dados de exemplo para o gráfico de barras. */
const TREINOS_POR_MES = [
  { mes: "Jan", treinos: 820 },
  { mes: "Fev", treinos: 910 },
  { mes: "Mar", treinos: 1040 },
  { mes: "Abr", treinos: 980 },
  { mes: "Mai", treinos: 1120 },
  { mes: "Jun", treinos: 1205 },
  { mes: "Jul", treinos: 1180 },
  { mes: "Ago", treinos: 1260 },
  { mes: "Set", treinos: 1190 },
  { mes: "Out", treinos: 1284 },
  { mes: "Nov", treinos: 1320 },
  { mes: "Dez", treinos: 1410 },
]

/* Eventos recentes para o painel de atividade. */
const ATIVIDADE: CollaborationEvent[] = [
  {
    id: "a1",
    actor: "Marina Alves",
    action: "concluiu o treino",
    target: "Full body A",
    at: "há 4 min",
    kind: "approve",
  },
  {
    id: "a2",
    actor: "Prof. Diego",
    action: "ajustou o plano de",
    target: "Rafael L.",
    at: "há 22 min",
    kind: "edit",
  },
  {
    id: "a3",
    actor: "Camila Souza",
    action: "deixou um comentário no treino",
    target: "Pernas B",
    at: "há 1 h",
    kind: "comment",
  },
  {
    id: "a4",
    actor: "João Pedro",
    action: "entrou na unidade",
    target: "Centro",
    at: "há 2 h",
    kind: "join",
  },
  {
    id: "a5",
    actor: "Prof. Aline",
    action: "aprovou a avaliação de",
    target: "Beatriz M.",
    at: "ontem",
    kind: "approve",
  },
]

const fmtTreinos = (v: number) => v.toLocaleString("pt-BR")

/**
 * StatsOverview: seção de visão geral para a área principal de um dashboard.
 * Linha de 4 KPIs no topo, um gráfico de treinos por mês (mais largo) e um
 * painel de atividade recente ao lado. Usa apenas componentes do kit.
 */
export function StatsOverview({
  className,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      data-slot="stats-overview"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div>
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Visão geral
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Desempenho da academia nos últimos 30 dias.
        </p>
      </div>

      {/* Linha de 4 KPIs — empilha no mobile, 2 colunas no tablet, 4 no desktop. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <KpiChart
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            trend={kpi.trend}
            data={kpi.data}
          />
        ))}
      </div>

      {/* Região em 2 colunas: gráfico (mais largo) + atividade recente. */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          label="Treinos por mês"
          value="13,9k"
          delta={{ text: "+8% vs. ano anterior", tone: "good" }}
          hint="Treinos registrados no app, por mês"
          footer="Comparado com o mesmo período de 2025"
          className="lg:col-span-2"
        >
          <BarsChart
            data={TREINOS_POR_MES}
            xKey="mes"
            yKey="treinos"
            label="Treinos"
            format={fmtTreinos}
            reference={{ y: 1100, label: "Meta" }}
            highlight={TREINOS_POR_MES.length - 1}
          />
        </ChartCard>

        <ChartCard
          label="Atividade recente"
          hint="Últimas ações de alunos e professores"
          className="lg:col-span-1"
        >
          <CollaborationStream events={ATIVIDADE} />
        </ChartCard>
      </div>
    </section>
  )
}
