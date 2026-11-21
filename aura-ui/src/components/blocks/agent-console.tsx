"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AgentMonitor,
  type AgentMonitorAgent,
  type AgentMonitorMetrics,
} from "@/components/ui/agent-monitor"
import { AgentFleet, type FleetAgent } from "@/components/ui/agent-fleet"
import { AgentInbox, type AgentInboxItem } from "@/components/ui/agent-inbox"
import { RunningNow } from "@/components/ui/running-now"
import { TraceWaterfall, type TraceSpan } from "@/components/ui/trace-waterfall"
import { ModelUsage, type ModelUsageItem } from "@/components/ui/model-usage"

const METRICS: AgentMonitorMetrics = {
  active: 3,
  queued: 5,
  done: 48,
  errors: 1,
}

const MONITOR_AGENTS: AgentMonitorAgent[] = [
  { id: "m1", name: "Triagem de tickets", status: "running" },
  { id: "m2", name: "Resumo de reuniões", status: "done" },
  { id: "m3", name: "Cobrança de faturas", status: "error" },
]

const FLEET: FleetAgent[] = [
  {
    id: "f1",
    name: "Agente de Vendas",
    status: "running",
    task: "Qualificando 12 leads do formulário do site",
    progress: 64,
  },
  {
    id: "f2",
    name: "Agente de Suporte",
    status: "running",
    task: "Respondendo dúvidas sobre o plano Pro",
    progress: 38,
  },
  {
    id: "f3",
    name: "Agente de Conteúdo",
    status: "done",
    task: "Gerou 4 posts para o blog da semana",
    progress: 100,
  },
  {
    id: "f4",
    name: "Agente Financeiro",
    status: "error",
    task: "Falha ao conectar com a API do banco",
  },
  {
    id: "f5",
    name: "Agente de Dados",
    status: "idle",
    task: "Aguardando o próximo lote da madrugada",
  },
  {
    id: "f6",
    name: "Agente de Pesquisa",
    status: "running",
    task: "Comparando 3 fornecedores de logística",
    progress: 21,
  },
]

const INBOX: AgentInboxItem[] = [
  {
    id: "i1",
    agent: "Agente de Vendas",
    title: "Aprovar desconto de 15% para a Padaria do Bairro?",
    detail: "Lead quente, orçamento acima de R$ 8.000/mês. Expira hoje.",
    kind: "approval",
  },
  {
    id: "i2",
    agent: "Agente de Suporte",
    title: "O cliente pediu reembolso fora da política de 7 dias.",
    detail: "Compra feita há 11 dias. Como devo proceder?",
    kind: "question",
  },
  {
    id: "i3",
    agent: "Agente Financeiro",
    title: "Transferir a conciliação de novembro para você.",
    detail: "Encontrei 3 lançamentos sem nota fiscal correspondente.",
    kind: "handoff",
  },
]

const TRACE: TraceSpan[] = [
  { id: "t1", label: "Receber requisição", start: 0, duration: 120, depth: 0 },
  { id: "t2", label: "Planejar tarefa", start: 120, duration: 340, depth: 1 },
  { id: "t3", label: "Buscar no CRM", start: 460, duration: 620, depth: 2 },
  {
    id: "t4",
    label: "Chamar modelo",
    start: 1080,
    duration: 1450,
    depth: 2,
  },
  {
    id: "t5",
    label: "Enviar e-mail",
    start: 2530,
    duration: 210,
    depth: 1,
    status: "error",
  },
]

const MODELS: ModelUsageItem[] = [
  { id: "mu1", name: "Opus 4.8", tokens: 1_240_000, cost: "$18.60" },
  { id: "mu2", name: "Sonnet 4.5", tokens: 820_000, cost: "$4.10" },
  { id: "mu3", name: "Haiku 4", tokens: 2_350_000, cost: "$1.88" },
]

function AgentConsole({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="agent-console"
      className={cn("flex w-full flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            Console de agentes
          </h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe a frota de agentes em tempo real e resolva o que precisa de
            você.
          </p>
        </div>
        <RunningNow
          agent="Agente de Vendas"
          step="Qualificando leads do site"
          elapsed="02:14"
          status="running"
        />
      </div>

      <AgentMonitor metrics={METRICS} agents={MONITOR_AGENTS} />

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,440px)]">
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-medium">Frota de agentes</h2>
          <AgentFleet agents={FLEET} />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-medium">Aguardando você</h2>
          <AgentInbox items={INBOX} className="max-w-full" />
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trace da última execução</CardTitle>
          </CardHeader>
          <CardContent>
            <TraceWaterfall spans={TRACE} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso por modelo (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ModelUsage models={MODELS} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { AgentConsole }
