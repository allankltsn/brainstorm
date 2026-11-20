import { type ReactNode, useEffect, useState } from 'react'
import { ChevronDown, Rocket, Settings, TriangleAlert, User } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { toast } from 'sonner'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Toaster } from '@/components/ui/sonner'
import { Inbox, Search } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Spinner } from '@/components/ui/spinner'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty-state'
import { Textarea } from '@/components/ui/textarea'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Calendar } from '@/components/ui/calendar'
import { Combobox } from '@/components/ui/combobox'
import { DatePicker } from '@/components/ui/date-picker'
import { NumberInput } from '@/components/ui/number-input'

import { StatCard } from '@/components/ui/stat-card'
import { Sparkline } from '@/components/ui/sparkline'
import { ChartCard } from '@/components/ui/chart-card'
import { TrendChart } from '@/components/ui/trend-chart'
import { NumberTicker } from '@/components/ui/number-ticker'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { MagicCard } from '@/components/ui/magic-card'
import { BorderBeam } from '@/components/ui/border-beam'
import { Marquee } from '@/components/ui/marquee'
import { DotPattern } from '@/components/ui/dot-pattern'
import { ApprovalCard } from '@/components/ui/approval-card'
import { ThinkingState } from '@/components/ui/thinking-state'
import { ToolCallCard } from '@/components/ui/tool-call-card'
import { ModelPicker } from '@/components/ui/model-picker'
import { ContextWindow } from '@/components/ui/context-window'
import { PermissionRequest } from '@/components/ui/permission-request'
import { AgentTrail } from '@/components/ui/agent-trail'
import { ChatComposer } from '@/components/ui/chat-composer'
import { AiAnswer } from '@/components/ui/ai-answer'
import { AiPrompt } from '@/components/ui/ai-prompt'
import { GlowCloud } from '@/components/ui/glow-cloud'
import { ThinkingLoader } from '@/components/ui/thinking-loader'
import { SmartRecommendation, type Recommendation } from '@/components/ui/smart-recommendation'
import { ChangeSummary } from '@/components/ui/change-summary'
import { DecisionInbox } from '@/components/ui/decision-inbox'
import { ProgressTracker } from '@/components/ui/progress-tracker'
import { Bold, Copy, Italic, Pencil, Trash2, Underline } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/segmented-control'
import { FormField, FormControl, FormDescription, FormLabel, FormMessage } from '@/components/ui/form-field'
import { CodeBlock } from '@/components/ui/code-block'
import { Rating } from '@/components/ui/rating'
import { UsageMeter } from '@/components/ui/usage-meter'
import { IconButton } from '@/components/ui/icon-button'
import { TagInput } from '@/components/ui/tag-input'
import { TreeView, type TreeNode } from '@/components/ui/tree-view'
import { ColorPicker } from '@/components/ui/color-picker'
import { TimePicker } from '@/components/ui/time-picker'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Dropzone } from '@/components/ui/dropzone'
import { DataTable } from '@/components/ui/data-table'
import { CommandMenu, useCommandMenu } from '@/components/ui/command-menu'
import { FileText, Settings2, UserPlus } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'

type Aluno = { nome: string; plano: string; treinos: number }
const alunos: Aluno[] = [
  { nome: 'Ana Souza', plano: 'Mensal', treinos: 12 },
  { nome: 'Bruno Lima', plano: 'Anual', treinos: 34 },
  { nome: 'Carla Dias', plano: 'Trimestral', treinos: 21 },
  { nome: 'Diego Reis', plano: 'Mensal', treinos: 8 },
]
const alunosColumns: ColumnDef<Aluno>[] = [
  { accessorKey: 'nome', header: 'Aluno' },
  { accessorKey: 'plano', header: 'Plano' },
  { accessorKey: 'treinos', header: 'Treinos' },
]

const comandoGrupos = [
  {
    heading: 'Ações',
    items: [
      { id: 'novo', label: 'Novo aluno', icon: <UserPlus />, shortcut: '⌘N' },
      { id: 'treino', label: 'Montar treino', icon: <FileText /> },
    ],
  },
  {
    heading: 'Geral',
    items: [{ id: 'config', label: 'Configurações', icon: <Settings2 />, shortcut: '⌘,' }],
  },
]

function CommandMenuDemo() {
  const { open, setOpen } = useCommandMenu()
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Abrir paleta <Kbd>⌘K</Kbd>
      </Button>
      <CommandMenu open={open} onOpenChange={setOpen} groups={comandoGrupos} />
    </>
  )
}

import { AgentGraph, type AgentNode as AgentGraphNode } from '@/components/ui/agent-graph'
import { AgentTree, type AgentNode as AgentTreeNode } from '@/components/ui/agent-tree'
import { AgentFleet, type FleetAgent } from '@/components/ui/agent-fleet'
import { AgentInbox, type AgentInboxItem } from '@/components/ui/agent-inbox'
import { AgentPlan, type PlanStep } from '@/components/ui/agent-plan'
import { AgentQueue, type AgentQueueItem } from '@/components/ui/agent-queue'
import { AgentWorkbench, type AgentWorkbenchAgent } from '@/components/ui/agent-workbench'
import { AgentCrew, type AgentCrewMember } from '@/components/ui/agent-crew'
import { AgentLanes, type AgentLane } from '@/components/ui/agent-lanes'

const grafoNodes: AgentGraphNode[] = [
  { id: 'plan', label: 'Planejar', status: 'done', col: 0, row: 0 },
  { id: 'code', label: 'Codar', status: 'running', col: 1, row: 0 },
  { id: 'test', label: 'Testar', status: 'idle', col: 2, row: 0 },
  { id: 'review', label: 'Revisar', status: 'idle', col: 2, row: 1 },
]
const grafoEdges = [
  { from: 'plan', to: 'code' },
  { from: 'code', to: 'test' },
  { from: 'code', to: 'review' },
]
const crewTree: AgentTreeNode = {
  id: 'lead', name: 'Orquestrador', role: 'lead', status: 'running',
  children: [
    { id: 'r', name: 'Pesquisador', role: 'worker', status: 'done' },
    {
      id: 'w', name: 'Redator', role: 'worker', status: 'running',
      children: [{ id: 'rev', name: 'Revisor', role: 'reviewer', status: 'idle' }],
    },
  ],
}
const frota: FleetAgent[] = [
  { id: '1', name: 'Scout', status: 'running', task: 'Varrendo o repositório', progress: 62 },
  { id: '2', name: 'Builder', status: 'done', task: 'Build concluído', progress: 100 },
  { id: '3', name: 'Tester', status: 'error', task: '2 testes falharam' },
]
const inboxItens: AgentInboxItem[] = [
  { id: '1', agent: 'Builder', title: 'Aprovar deploy em produção', detail: 'Pages · brainstorm', kind: 'approval' },
  { id: '2', agent: 'Scout', title: 'Qual branch devo analisar?', kind: 'question' },
]
const planoSteps: PlanStep[] = [
  { id: '1', label: 'Ler o PLANO.md', status: 'done' },
  {
    id: '2', label: 'Gerar componentes', status: 'active', detail: 'onda 3A',
    substeps: [
      { id: '2a', label: 'agent-graph', status: 'done' },
      { id: '2b', label: 'agent-fleet', status: 'active' },
    ],
  },
  { id: '3', label: 'Publicar no Pages', status: 'pending' },
]
const fila: AgentQueueItem[] = [
  { id: '1', label: 'Indexar documentação', priority: 'high', eta: '~2 min', status: 'running' },
  { id: '2', label: 'Resumir issues', priority: 'normal', eta: '~5 min', status: 'queued' },
  { id: '3', label: 'Limpar caches', priority: 'low', status: 'queued' },
]
const wbAgent: AgentWorkbenchAgent = { name: 'Codador', model: 'Opus 4.8', status: 'running' }
const wbTools = [
  { id: '1', name: 'read_file(App.tsx)', status: 'done' as const },
  { id: '2', name: 'edit_file(registry.json)', status: 'running' as const },
]
const crewMembers: AgentCrewMember[] = [
  { id: '1', name: 'Orquestrador', role: 'lead', status: 'running', task: 'Coordenando a onda' },
  { id: '2', name: 'Pesquisador', role: 'worker', status: 'done' },
  { id: '3', name: 'Revisor', role: 'reviewer', status: 'idle' },
]
const laneData: AgentLane[] = [
  { id: 'q', title: 'Fila', items: [{ id: '1', label: 'Indexar docs', agent: 'Scout' }, { id: '2', label: 'Resumir PRs' }] },
  { id: 'r', title: 'Executando', items: [{ id: '3', label: 'Gerar testes', agent: 'Codador' }] },
  { id: 'd', title: 'Pronto', items: [] },
]

import { AgentHandoff, type Handoff } from '@/components/ui/agent-handoff'
import { AgentSequence, type AgentSequenceStep } from '@/components/ui/agent-sequence'
import { AgentRouter, type AgentCandidate } from '@/components/ui/agent-router'
import { AgentSteering } from '@/components/ui/agent-steering'
import { AgentMonitor, type AgentMonitorMetrics, type AgentMonitorAgent } from '@/components/ui/agent-monitor'
import { AgentTiming, type AgentTimingPhase } from '@/components/ui/agent-timing'
import { AgentCheckpoints, type AgentCheckpoint } from '@/components/ui/agent-checkpoints'
import { AgentRecap, type AgentRecapStat, type AgentRecapAction } from '@/components/ui/agent-recap'
import { AgentCursors, type AgentCursor } from '@/components/ui/agent-cursors'

const handoffs: Handoff[] = [
  { id: '1', from: 'Planejador', to: 'Codador', task: 'Implementar o registry', at: '14:02' },
  { id: '2', from: 'Codador', to: 'Revisor', task: 'Revisar o diff', at: '14:19' },
]
const sequencia: AgentSequenceStep[] = [
  { id: '1', agent: 'Planejador', action: 'Definiu o plano', status: 'done' },
  { id: '2', agent: 'Codador', action: 'Gerando componentes', status: 'active' },
  { id: '3', agent: 'Revisor', action: 'Aguardando', status: 'pending' },
]
const rotaCandidatos: AgentCandidate[] = [
  { id: '1', name: 'Codador', score: 92, selected: true, reason: 'Melhor em edição de código' },
  { id: '2', name: 'Pesquisador', score: 61, reason: 'Bom em busca' },
  { id: '3', name: 'Revisor', score: 44 },
]
const monitorMetrics: AgentMonitorMetrics = { active: 3, queued: 2, done: 10, errors: 1 }
const monitorAgents: AgentMonitorAgent[] = [
  { id: '1', name: 'Scout', status: 'running' },
  { id: '2', name: 'Builder', status: 'done' },
  { id: '3', name: 'Tester', status: 'error' },
]
const fases: AgentTimingPhase[] = [
  { id: '1', label: 'Planejar', ms: 1200 },
  { id: '2', label: 'Codar', ms: 4800 },
  { id: '3', label: 'Testar', ms: 2100 },
  { id: '4', label: 'Publicar', ms: 900 },
]
const checkpoints: AgentCheckpoint[] = [
  { id: '1', label: 'Após o plano', at: '14:02' },
  { id: '2', label: 'Componentes gerados', at: '14:20' },
  { id: '3', label: 'Agora', at: '14:31', current: true },
]
const recapStats: AgentRecapStat[] = [
  { label: 'Componentes', value: 18 },
  { label: 'Testes', value: 129 },
  { label: 'Duração', value: '9 min' },
]
const recapActions: AgentRecapAction[] = [
  { id: '1', label: 'Registry atualizado', status: 'done' },
  { id: '2', label: 'Publicado no Pages', status: 'done' },
]
const cursores: AgentCursor[] = [
  { id: '1', name: 'Scout', x: 20, y: 28 },
  { id: '2', name: 'Codador', x: 60, y: 54, color: '#8b5cf6' },
  { id: '3', name: 'Revisor', x: 38, y: 72, color: '#10b981' },
]

import { AgentFindings, type AgentFinding } from '@/components/ui/agent-findings'
import { AgentLedger, type AgentLedgerEntry } from '@/components/ui/agent-ledger'
import { ApprovalGates, type ApprovalGate } from '@/components/ui/approval-gates'
import { AutonomyDial } from '@/components/ui/autonomy-dial'
import { RunControls } from '@/components/ui/run-controls'
import { RunningNow } from '@/components/ui/running-now'
import { ScheduledRuns, type ScheduledRun } from '@/components/ui/scheduled-runs'
import { DelegateBoard, type DelegateTask } from '@/components/ui/delegate-board'
import { FanOutGrid, type FanOutCell } from '@/components/ui/fan-out-grid'

const findings: AgentFinding[] = [
  { id: '1', title: 'Chave de API exposta no cliente', severity: 'critical', location: 'src/api.ts:12' },
  { id: '2', title: 'Dependência desatualizada', severity: 'medium', location: 'package.json', detail: 'vite 7 → 8' },
  { id: '3', title: 'TODO sem dono', severity: 'low', location: 'App.tsx:40' },
]
const ledger: AgentLedgerEntry[] = [
  { id: '1', at: '14:32:10', label: 'read_file(App.tsx)', kind: 'tool' },
  { id: '2', at: '14:32:14', label: 'Opus 4.8 · 3,2k tokens', kind: 'model', amount: 'R$ 0,04' },
  { id: '3', at: '14:33:01', label: 'edit_file(registry.json)', kind: 'tool' },
]
const gates: ApprovalGate[] = [
  { id: '1', label: 'Revisão de código', status: 'approved', approver: 'Ana' },
  { id: '2', label: 'Aprovar deploy', status: 'pending' },
  { id: '3', label: 'Liberar em produção', status: 'blocked' },
]
const scheduled: ScheduledRun[] = [
  { id: '1', label: 'Resumo diário', schedule: '0 9 * * *', nextRun: 'amanhã 09:00', enabled: true },
  { id: '2', label: 'Limpeza semanal', schedule: '0 3 * * 1', nextRun: 'seg 03:00', enabled: false },
]
const delegateTasks: DelegateTask[] = [
  { id: '1', title: 'Escrever testes', assignee: 'Ana', status: 'doing' },
  { id: '2', title: 'Revisar PR #42', assignee: 'Bruno', status: 'todo' },
  { id: '3', title: 'Atualizar docs', status: 'blocked' },
]
const fanCells: FanOutCell[] = [
  { id: '1', label: 'Tentativa 1', status: 'done' },
  { id: '2', label: 'Tentativa 2', status: 'done' },
  { id: '3', label: 'Tentativa 3', status: 'running' },
  { id: '4', label: 'Tentativa 4', status: 'running' },
  { id: '5', label: 'Tentativa 5', status: 'error' },
  { id: '6', label: 'Tentativa 6', status: 'pending' },
]

const arvore: TreeNode[] = [
  {
    id: 'src', label: 'src', defaultOpen: true, children: [
      { id: 'app', label: 'App.tsx' },
      {
        id: 'comp', label: 'components', children: [
          { id: 'ui', label: 'ui' },
        ],
      },
    ],
  },
  { id: 'pkg', label: 'package.json' },
]

const recomendacoes: Recommendation[] = [
  { id: 'inc', label: 'Sincronização incremental', reason: 'Transfere apenas o que mudou.', signal: 3 },
  { id: 'full', label: 'Sincronização completa', reason: 'Reenvia tudo a cada execução.', signal: 1 },
]

const modelos = [
  { id: 'opus', label: 'Opus 4.8', provider: 'Anthropic', badge: 'Novo' },
  { id: 'sonnet', label: 'Sonnet 5.5', provider: 'Anthropic' },
  { id: 'haiku', label: 'Haiku 5.5', provider: 'Anthropic' },
]

const trilha = [
  { id: '1', label: 'Ler o plano', status: 'done' as const },
  { id: '2', label: 'Escrever o componente', status: 'active' as const, detail: 'src/app.tsx' },
  { id: '3', label: 'Rodar os testes', status: 'pending' as const },
]

const cidades = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'bh', label: 'Belo Horizonte' },
]

const trendData = [
  { mes: 'Jan', treinos: 120, meta: 100 },
  { mes: 'Fev', treinos: 150, meta: 110 },
  { mes: 'Mar', treinos: 130, meta: 120 },
  { mes: 'Abr', treinos: 180, meta: 130 },
  { mes: 'Mai', treinos: 170, meta: 140 },
]

const chartConfig = {
  treinos: { label: 'Treinos', color: 'var(--chart-1)' },
} satisfies ChartConfig

const chartData = [
  { dia: 'Seg', treinos: 4 },
  { dia: 'Ter', treinos: 7 },
  { dia: 'Qua', treinos: 5 },
  { dia: 'Qui', treinos: 9 },
  { dia: 'Sex', treinos: 6 },
]
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

type Mode = 'light' | 'dark'
type View = 'tokens' | 'componentes'

const THEMES = [
  { name: 'aura-fit', label: 'Aura Fit' },
  { name: 'aura-brand', label: 'Aura Brand' },
]

const COLOR_GROUPS: { grupo: string; tokens: string[] }[] = [
  {
    grupo: 'Base e superfícies',
    tokens: [
      'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
      'secondary', 'secondary-foreground', 'muted', 'muted-foreground', 'accent', 'accent-foreground',
      'border', 'input',
    ],
  },
  { grupo: 'Marca', tokens: ['primary', 'primary-foreground', 'ring', 'brand-soft', 'brand-text'] },
  {
    grupo: 'Feedback',
    tokens: ['destructive', 'success', 'success-soft', 'warning', 'warning-soft', 'info', 'info-soft'],
  },
  { grupo: 'Charts', tokens: ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] },
  {
    grupo: 'Sidebar',
    tokens: [
      'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
      'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring',
    ],
  },
]

const RADII = [
  { nome: 'sm', mult: 0.6 }, { nome: 'md', mult: 0.8 }, { nome: 'lg', mult: 1 },
  { nome: 'xl', mult: 1.4 }, { nome: '2xl', mult: 1.8 }, { nome: '3xl', mult: 2.2 }, { nome: '4xl', mult: 2.6 },
]

function useComputedVars(deps: unknown[]) {
  const [vars, setVars] = useState<Record<string, string>>({})
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    const all = COLOR_GROUPS.flatMap((g) => g.tokens)
    const next: Record<string, string> = {}
    for (const t of all) next[t] = cs.getPropertyValue(`--${t}`).trim()
    setVars(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return vars
}

function Segmented<T extends string>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void; options: { value: T; label: string }[]
}) {
  return (
    <div className="seg" role="group">
      {options.map((o) => (
        <button key={o.value} type="button" className="seg-btn" data-active={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function TokensView({ theme, mode }: { theme: string; mode: Mode }) {
  const vars = useComputedVars([theme, mode])
  return (
    <>
      <section className="intro">
        <h1>Design tokens</h1>
        <p>
          Uma fonte única (<code>tokens/</code>) gera o CSS de cada tema. Trocar o tema acima
          recolore tudo — a marca é uma cor só. Contraste verificado em WCAG AA no build.
        </p>
      </section>

      <section>
        <h2>Cores</h2>
        {COLOR_GROUPS.map((g) => (
          <div key={g.grupo} className="group">
            <h3>{g.grupo}</h3>
            <div className="swatches">
              {g.tokens.map((t) => (
                <div key={t} className="swatch">
                  <div className="chip" style={{ background: `var(--${t})` }} />
                  <div className="swatch-meta">
                    <code>--{t}</code>
                    <span className="val">{vars[t] || ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2>Tipografia</h2>
        <div className="type-card">
          <span className="type-tag">font-sans · display-lg</span>
          <p className="t-display">Aura — movimento com clareza</p>
          <span className="type-tag">heading</span>
          <p className="t-heading">Seções, títulos e ênfase</p>
          <span className="type-tag">body-md</span>
          <p className="t-body">
            Corpo de texto em Geist. O kit usa três slots de fonte: sans, heading (igual ao corpo
            por padrão) e mono. Cada tema pode trocar a sans.
          </p>
          <span className="type-tag">label-md · mono</span>
          <p className="t-mono">--primary · 0.75rem · JetBrains Mono</p>
        </div>
      </section>

      <section>
        <h2>Raio</h2>
        <p className="muted">Escala derivada de <code>--radius</code> (base 0.75rem): sm…4xl.</p>
        <div className="radii">
          {RADII.map((r) => (
            <div key={r.nome} className="radius-item">
              <div className="radius-box" style={{ borderRadius: r.mult === 1 ? 'var(--radius)' : `calc(var(--radius) * ${r.mult})` }} />
              <code>{r.nome}</code>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function Demo({ title, children, full = false }: { title: string; children: ReactNode; full?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-3 font-mono text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">{title}</h3>
      <div className={full ? 'flex flex-col gap-3' : 'flex flex-wrap items-center gap-3'}>{children}</div>
    </div>
  )
}

function ComponentsView() {
  return (
    <>
      <section className="intro">
        <h1>Componentes</h1>
        <p>
          Primitivos instaláveis pelo CLI do shadcn a partir do registry <code>@aura</code>
          {' '}(<code>npx shadcn add @aura/button</code>). Mesmos tokens da aba Tokens — trocar o
          tema recolore tudo. Lote inicial da Fase 2.
        </p>
      </section>

      <div className="grid gap-4">
        <Demo title="Button · variantes">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </Demo>

        <Demo title="Button · tamanhos e ícone">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button><Rocket /> Com ícone</Button>
          <Button disabled>Desabilitado</Button>
        </Demo>

        <Demo title="Badge">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </Demo>

        <Demo title="Alert" full>
          <Alert>
            <Rocket />
            <AlertTitle>Tudo certo</AlertTitle>
            <AlertDescription>Seu treino foi salvo e sincronizado.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>Não foi possível salvar</AlertTitle>
            <AlertDescription>Verifique a conexão e tente de novo.</AlertDescription>
          </Alert>
        </Demo>

        <Demo title="Card" full>
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Plano Premium</CardTitle>
              <CardDescription>Acesso completo ao app e aos treinos.</CardDescription>
              <CardAction>
                <Badge>Novo</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">R$ 49/mês · cancele quando quiser.</p>
            </CardContent>
            <CardFooter>
              <Button>Assinar</Button>
            </CardFooter>
          </Card>
        </Demo>

        <Demo title="Input + Label" full>
          <div className="grid max-w-sm gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="voce@exemplo.com" />
          </div>
        </Demo>

        <Demo title="Separator" full>
          <div className="text-sm">Acima</div>
          <Separator />
          <div className="text-sm">Abaixo</div>
        </Demo>

        <Demo title="Skeleton" full>
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="grid gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </Demo>

        <Demo title="Avatar">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
        </Demo>

        <Demo title="Tabs" full>
          <Tabs defaultValue="perfil" className="max-w-sm">
            <TabsList>
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="treino">Treino</TabsTrigger>
            </TabsList>
            <TabsContent value="perfil" className="text-sm text-muted-foreground">Dados do perfil.</TabsContent>
            <TabsContent value="treino" className="text-sm text-muted-foreground">Seu treino da semana.</TabsContent>
          </Tabs>
        </Demo>

        <Demo title="Tooltip">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Passe o mouse</Button>
              </TooltipTrigger>
              <TooltipContent>Dica útil</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Demo>

        <Demo title="Progress" full>
          <Progress value={62} className="max-w-sm" />
        </Demo>

        <Demo title="Breadcrumb" full>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Início</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Alunos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Ana</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Demo>

        <Demo title="Table" full>
          <Table>
            <TableCaption>Alunos ativos</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Plano</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Ana</TableCell>
                <TableCell>Mensal</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bruno</TableCell>
                <TableCell>Anual</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Demo>

        <Demo title="ScrollArea" full>
          <ScrollArea className="h-28 w-full max-w-sm rounded-lg border border-border p-3">
            <div className="grid gap-2 text-sm">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i}>Item {i + 1}</div>
              ))}
            </div>
          </ScrollArea>
        </Demo>

        <Demo title="Dialog · Sheet · Dropdown">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Abrir dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar</DialogTitle>
                <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Entendi</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Abrir sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Configurações</SheetTitle>
                <SheetDescription>Ajuste suas preferências.</SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="secondary">Fechar</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Menu <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User /> Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings /> Configurações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Demo>

        <Demo title="Chart" full>
          <ChartContainer config={chartConfig} className="h-48 w-full max-w-md">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="dia" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="treinos" fill="var(--color-treinos)" radius={4} />
            </BarChart>
          </ChartContainer>
        </Demo>

        <Demo title="Sonner (toast)">
          <Toaster />
          <Button onClick={() => toast('Treino salvo', { description: 'Sincronizado agora.' })}>
            Mostrar toast
          </Button>
        </Demo>

        <Demo title="Sidebar" full>
          <p className="text-sm text-muted-foreground">
            Componente de layout (SidebarProvider + Sidebar + SidebarMenu…). Instalável com{' '}
            <code>npx shadcn add @aura/sidebar</code>. Não renderizado aqui por ocupar a tela inteira.
          </p>
        </Demo>

        <Demo title="Accordion" full>
          <Accordion type="single" collapsible className="w-full max-w-md">
            <AccordionItem value="a">
              <AccordionTrigger>É acessível?</AccordionTrigger>
              <AccordionContent>Sim, segue o padrão WAI-ARIA.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Tem animação?</AccordionTrigger>
              <AccordionContent>Sim, via accordion-up/down.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Demo>

        <Demo title="Radio group · Slider · Textarea · Number" full>
          <div className="grid max-w-md gap-5">
            <RadioGroup defaultValue="mensal">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="mensal" id="p-mensal" />
                <Label htmlFor="p-mensal">Mensal</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="anual" id="p-anual" />
                <Label htmlFor="p-anual">Anual</Label>
              </div>
            </RadioGroup>
            <Slider defaultValue={[40]} max={100} />
            <Textarea placeholder="Observações do treino…" />
            <NumberInput defaultValue={1} min={0} max={10} />
          </div>
        </Demo>

        <Demo title="Popover · Combobox · Date picker">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-sm">Ajuste suas preferências aqui.</p>
            </PopoverContent>
          </Popover>
          <Combobox options={cidades} placeholder="Escolha a cidade" />
          <DatePicker />
        </Demo>

        <Demo title="Command" full>
          <Command className="max-w-md rounded-lg border border-border">
            <CommandInput placeholder="Buscar…" />
            <CommandList>
              <CommandEmpty>Nenhum resultado.</CommandEmpty>
              <CommandGroup heading="Ações">
                <CommandItem>
                  <Search /> Buscar aluno
                </CommandItem>
                <CommandItem>
                  <Inbox /> Abrir caixa de entrada
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Demo>

        <Demo title="Calendar" full>
          <Calendar mode="single" className="rounded-lg border border-border" />
        </Demo>

        <Demo title="Pagination · Spinner · Kbd" full>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="flex items-center gap-3">
            <Spinner />
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </div>
        </Demo>

        <Demo title="Empty state" full>
          <Empty className="max-w-md">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Inbox />
              </EmptyMedia>
              <EmptyTitle>Nenhum aluno ainda</EmptyTitle>
              <EmptyDescription>Convide seu primeiro aluno para começar.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>Convidar aluno</Button>
            </EmptyContent>
          </Empty>
        </Demo>

        <Demo title="Charts · Stat card · Sparkline" full>
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Alunos ativos" value="128" delta={{ text: '+12 no mês' }} />
              <StatCard label="Treinos/semana" value="1.240" delta={{ text: '+8%' }} />
              <StatCard label="Churn" value="2,1%" delta={{ text: '-0,4pp', tone: 'good' }} />
            </div>
            <ChartCard
              label="Treinos no mês"
              value="170"
              delta={{ text: '+13% vs. meta' }}
              className="max-w-xl"
            >
              <TrendChart
                data={trendData}
                xKey="mes"
                series={[
                  { key: 'treinos', label: 'Treinos' },
                  { key: 'meta', label: 'Meta', muted: true, dashed: true },
                ]}
                area
              />
            </ChartCard>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Tendência semanal <Sparkline data={[3, 5, 4, 8, 6, 9, 7]} tone="good" />
            </div>
          </div>
        </Demo>

        <Demo title="Motion" full>
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-3xl font-semibold tabular-nums">
                <NumberTicker value={1240} />
              </div>
              <AnimatedShinyText className="text-sm">✨ Novo recurso disponível</AnimatedShinyText>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <MagicCard className="rounded-xl p-5">
                <h3 className="font-heading font-medium">Plano Pro</h3>
                <p className="mt-1 text-sm text-muted-foreground">Passe o mouse para o brilho seguir.</p>
              </MagicCard>
              <div className="relative overflow-hidden rounded-xl border border-border p-5">
                <h3 className="font-heading font-medium">Border beam</h3>
                <p className="mt-1 text-sm text-muted-foreground">Feixe percorrendo a borda.</p>
                <BorderBeam size={60} duration={8} colorFrom="var(--primary)" colorTo="var(--chart-2)" />
              </div>
            </div>
            <div className="relative h-24 overflow-hidden rounded-xl border border-border">
              <DotPattern className="text-muted-foreground/40" />
              <div className="relative flex h-full items-center px-4 text-sm text-muted-foreground">
                Fundo com dot-pattern
              </div>
            </div>
            <Marquee className="[--duration:18s] text-sm text-muted-foreground" pauseOnHover>
              <span className="mx-4">Aura Fit</span>
              <span className="mx-4">Aura Brand</span>
              <span className="mx-4">Aura UI</span>
              <span className="mx-4">shadcn</span>
              <span className="mx-4">Radix</span>
            </Marquee>
          </div>
        </Demo>

        <Demo title="Padrões de IA" full>
          <div className="grid gap-4 lg:grid-cols-2">
            <ApprovalCard
              title="Publicar release v2.1"
              description="A IA preparou o changelog e quer sua aprovação."
              details={<p className="text-xs text-muted-foreground">12 commits · 3 arquivos</p>}
            />
            <PermissionRequest
              title="Acessar o repositório?"
              description="O agente quer ler os arquivos do projeto."
              scope="Ler arquivos do projeto"
            />
            <ToolCallCard
              name="search_web"
              status="success"
              args={'{"q":"aura ui","limit":5}'}
              result="2 resultados encontrados"
            />
            <div className="grid content-start gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <ModelPicker models={modelos} />
                <ThinkingState>analisando o plano…</ThinkingState>
              </div>
              <ContextWindow used={120000} total={200000} />
              <AgentTrail steps={trilha} />
            </div>
          </div>
        </Demo>

        <Demo title="Conversa com IA" full>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="grid content-start gap-3">
              <AiPrompt suggestions={['Resumir o plano', 'Gerar treino da semana']} />
              <ChatComposer />
            </div>
            <AiAnswer
              title="Aura"
              citations={[
                { id: 1, label: 'PLANO.md', href: '#' },
                { id: 2, label: 'treinos.csv' },
              ]}
            >
              <p>Seu plano prioriza progressão de carga e dois dias de descanso.</p>
              <p>Ajustei o volume de segunda com base no histórico.</p>
            </AiAnswer>
          </div>
        </Demo>

        <Demo title="Assistente Aura (affectUI reescrito)" full>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-6">
              <GlowCloud background={false} mood="thinking" className="size-28" />
              <ThinkingLoader />
            </div>
            <SmartRecommendation title="Sugestão de sincronização" options={recomendacoes} />
            <ChangeSummary
              title="O que mudou"
              period="Esta semana"
              changes={[
                { label: 'Treinos concluídos', change: 'Subiu 6,1% para 18,2K', tone: 'good' },
                { label: 'Faltas', change: 'Caiu 2,3% para 41', tone: 'bad', direction: 'down' },
                { label: 'Novos alunos', change: 'Sem mudança', tone: 'neutral' },
              ]}
            />
            <ProgressTracker
              title="Primeiros passos"
              steps={[
                { id: '1', label: 'Criar conta', done: true },
                { id: '2', label: 'Convidar aluno' },
                { id: '3', label: 'Montar treino' },
              ]}
            />
            <div className="lg:col-span-2">
              <DecisionInbox
                decisions={[
                  { id: '1', title: 'Aprovar pagamento ao fornecedor', detail: 'R$ 1.284 à academia parceira', primary: 'Aprovar', secondary: 'Recusar' },
                  { id: '2', title: 'Liberar acesso do novo aluno', primary: 'Liberar', secondary: 'Negar', collapsed: true },
                ]}
              />
            </div>
          </div>
        </Demo>

        <Demo title="Checkbox · Switch · Toggle · Toggle group" full>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked /> Aceito os termos
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch defaultChecked /> Notificações
            </label>
            <Toggle aria-label="Negrito"><Bold /></Toggle>
            <ToggleGroup type="multiple" defaultValue={['bold']}>
              <ToggleGroupItem value="bold" aria-label="Negrito"><Bold /></ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Itálico"><Italic /></ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Sublinhado"><Underline /></ToggleGroupItem>
            </ToggleGroup>
          </div>
        </Demo>

        <Demo title="Select">
          <Select defaultValue="sp">
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Escolha a cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cidades</SelectLabel>
                {cidades.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Demo>

        <Demo title="Segmented control · Rating">
          <SegmentedControl defaultValue="semana">
            <SegmentedControlItem value="dia">Dia</SegmentedControlItem>
            <SegmentedControlItem value="semana">Semana</SegmentedControlItem>
            <SegmentedControlItem value="mes">Mês</SegmentedControlItem>
          </SegmentedControl>
          <Rating defaultValue={4} />
        </Demo>

        <Demo title="Icon button · Tag input" full>
          <div className="flex items-center gap-2">
            <IconButton label="Copiar" tooltip><Copy /></IconButton>
            <IconButton label="Editar" tooltip variant="outline"><Pencil /></IconButton>
            <IconButton label="Excluir" tooltip variant="destructive"><Trash2 /></IconButton>
          </div>
          <TagInput defaultValue={['react', 'tailwind', 'shadcn']} placeholder="Adicionar tag…" />
        </Demo>

        <Demo title="Input OTP" full>
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </Demo>

        <Demo title="Form field" full>
          <FormField error>
            <FormLabel>E-mail</FormLabel>
            <FormControl>
              <Input type="email" placeholder="voce@exemplo.com" defaultValue="invalido" />
            </FormControl>
            <FormDescription>Usamos para enviar o resumo semanal.</FormDescription>
            <FormMessage>Informe um e-mail válido.</FormMessage>
          </FormField>
        </Demo>

        <Demo title="Usage meter" full>
          <UsageMeter label="Tokens" value={7200} max={10000} unit=" tk" />
          <UsageMeter label="Armazenamento" value={4.2} max={5} unit=" GB" />
        </Demo>

        <Demo title="Context menu · Hover card">
          <ContextMenu>
            <ContextMenuTrigger className="flex h-24 w-56 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              Clique com o botão direito
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Abrir<ContextMenuShortcut>⌘O</ContextMenuShortcut></ContextMenuItem>
              <ContextMenuItem>Renomear</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive">Excluir</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">@aura-ui</Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-sm">Kit de UI do ecossistema Aura, com tokens por tema.</p>
            </HoverCardContent>
          </HoverCard>
        </Demo>

        <Demo title="Resizable" full>
          <ResizablePanelGroup direction="horizontal" className="h-32 rounded-lg border border-border">
            <ResizablePanel defaultSize={40}>
              <div className="flex h-full items-center justify-center p-4 text-sm">Painel A</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60}>
              <div className="flex h-full items-center justify-center p-4 text-sm">Painel B</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Demo>

        <Demo title="Tree view · Code block" full>
          <div className="grid gap-4 lg:grid-cols-2">
            <TreeView nodes={arvore} />
            <CodeBlock
              filename="button.tsx"
              language="tsx"
              showLineNumbers
              code={`export function Button() {\n  return <button className="btn" />\n}`}
            />
          </div>
        </Demo>

        <Demo title="Color · Time · Date range picker">
          <ColorPicker defaultValue="#ef4444" />
          <TimePicker defaultValue="07:30" />
          <DateRangePicker
            defaultValue={{ from: new Date(2026, 0, 10), to: new Date(2026, 0, 20) }}
          />
        </Demo>

        <Demo title="Command menu (⌘K)">
          <CommandMenuDemo />
        </Demo>

        <Demo title="Dropzone" full>
          <Dropzone accept="image/*" />
        </Demo>

        <Demo title="Data table" full>
          <DataTable columns={alunosColumns} data={alunos} searchKey="nome" searchPlaceholder="Filtrar por aluno…" />
        </Demo>

        <section className="intro" style={{ marginTop: '1.5rem' }}>
          <h2>Orquestração de agentes</h2>
          <p>Componentes para UIs de agentes de IA — reescritos no padrão aura-ui (paridade com o catálogo affectUI).</p>
        </section>

        <Demo title="Agent graph · Agent tree" full>
          <div className="grid gap-4 lg:grid-cols-2">
            <AgentGraph nodes={grafoNodes} edges={grafoEdges} />
            <AgentTree root={crewTree} />
          </div>
        </Demo>

        <Demo title="Agent fleet" full>
          <AgentFleet agents={frota} />
        </Demo>

        <Demo title="Agent plan · Agent queue" full>
          <div className="grid gap-4 lg:grid-cols-2">
            <AgentPlan title="Plano do agente" steps={planoSteps} />
            <AgentQueue items={fila} />
          </div>
        </Demo>

        <Demo title="Agent workbench" full>
          <AgentWorkbench agent={wbAgent} currentAction="Editando registry.json" toolCalls={wbTools} />
        </Demo>

        <Demo title="Agent crew" full>
          <AgentCrew members={crewMembers} />
        </Demo>

        <Demo title="Agent inbox" full>
          <AgentInbox items={inboxItens} />
        </Demo>

        <Demo title="Agent lanes" full>
          <AgentLanes lanes={laneData} />
        </Demo>

        <Demo title="Agent sequence · Agent handoff" full>
          <AgentSequence steps={sequencia} />
          <AgentHandoff handoffs={handoffs} />
        </Demo>

        <Demo title="Agent router" full>
          <AgentRouter request="Refatorar o módulo de autenticação" candidates={rotaCandidatos} />
        </Demo>

        <Demo title="Agent monitor" full>
          <AgentMonitor metrics={monitorMetrics} agents={monitorAgents} />
        </Demo>

        <Demo title="Agent timing" full>
          <AgentTiming phases={fases} />
        </Demo>

        <Demo title="Agent checkpoints · Agent recap" full>
          <div className="grid gap-4 lg:grid-cols-2">
            <AgentCheckpoints checkpoints={checkpoints} />
            <AgentRecap summary="O agente gerou e publicou 18 componentes do kit em 9 minutos." stats={recapStats} actions={recapActions} />
          </div>
        </Demo>

        <Demo title="Agent steering · Agent cursors" full>
          <AgentSteering suggestions={['Seja mais conciso', 'Priorize testes', 'Explique o porquê']} />
          <AgentCursors cursors={cursores} />
        </Demo>

        <Demo title="Run controls · Running now · Autonomy dial" full>
          <RunControls status="running" />
          <RunningNow agent="Codador" step="Editando registry.json" elapsed="00:42" />
          <AutonomyDial defaultValue="supervised" />
        </Demo>

        <Demo title="Approval gates · Fan-out grid" full>
          <div className="grid gap-4 lg:grid-cols-2">
            <ApprovalGates gates={gates} />
            <FanOutGrid title="8 tentativas paralelas" cells={fanCells} />
          </div>
        </Demo>

        <Demo title="Agent findings" full>
          <AgentFindings findings={findings} />
        </Demo>

        <Demo title="Agent ledger" full>
          <AgentLedger entries={ledger} />
        </Demo>

        <Demo title="Delegate board · Scheduled runs" full>
          <div className="grid gap-4 lg:grid-cols-2">
            <DelegateBoard tasks={delegateTasks} />
            <ScheduledRuns runs={scheduled} />
          </div>
        </Demo>
      </div>
    </>
  )
}

export default function App() {
  const [theme, setTheme] = useState('aura-fit')
  const [mode, setMode] = useState<Mode>('dark')
  const [view, setView] = useState<View>('tokens')

  useEffect(() => {
    const el = document.documentElement
    el.setAttribute('data-theme', theme)
    el.setAttribute('data-mode', mode)
  }, [theme, mode])

  return (
    <div className="page">
      <header className="topbar">
        <div className="brandline">
          <span className="mark" aria-hidden="true" />
          <strong>aura-ui</strong>
          <span className="pill">Fase 3.5</span>
        </div>
        <nav className="nav">
          <button type="button" className="nav-btn" data-active={view === 'tokens'} onClick={() => setView('tokens')}>Tokens</button>
          <button type="button" className="nav-btn" data-active={view === 'componentes'} onClick={() => setView('componentes')}>Componentes</button>
        </nav>
        <div className="controls">
          <Segmented value={theme} onChange={setTheme} options={THEMES.map((t) => ({ value: t.name, label: t.label }))} />
          <Segmented value={mode} onChange={setMode} options={[{ value: 'light', label: 'Claro' }, { value: 'dark', label: 'Escuro' }]} />
        </div>
      </header>

      <main className="wrap">
        {view === 'tokens' ? <TokensView theme={theme} mode={mode} /> : <ComponentsView />}
      </main>

      <footer className="foot">
        aura-ui · versão 0.1.1 · tema <strong>{theme}</strong> · {mode === 'light' ? 'claro' : 'escuro'}
      </footer>
    </div>
  )
}
