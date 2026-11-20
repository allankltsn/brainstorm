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
      </div>
    </>
  )
}

export default function App() {
  const [theme, setTheme] = useState('aura-fit')
  const [mode, setMode] = useState<Mode>('light')
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
          <span className="pill">Fase 2</span>
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
