import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Button as AButton } from '@/components/affect/button'
import { Checkbox } from '@/components/affect/checkbox'
import { FilterMenu } from '@/components/affect/filter-menu'
import { NotificationStack } from '@/components/affect/notification-stack'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { ShimmerText, Skeleton as ASkeleton } from '@/components/affect/shimmer-loader'
import { Switch } from '@/components/affect/switch'
import { TextField } from '@/components/affect/text-field'
import { ThinkingLoader } from '@/components/affect/thinking-loader'
import { TipsPanel } from '@/components/affect/tips-panel'
import { PageHeader, Pill, Section } from '@/components/page'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const SWATCHES: [string, string][] = [
  ['background', 'Fundo'],
  ['card', 'Cartão'],
  ['muted', 'Apoio'],
  ['border', 'Linha'],
  ['foreground', 'Texto'],
  ['muted-foreground', 'Texto de apoio'],
  ['primary', 'Marca'],
  ['brand-soft', 'Marca suave'],
  ['success', 'Sucesso'],
  ['warning', 'Atenção'],
  ['destructive', 'Erro'],
  ['info', 'Informação'],
]

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-t py-4 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr] sm:items-center">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex min-w-0 flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

export function DesignSystem() {
  const [loading, setLoading] = useState(false)
  return (
    <>
      <PageHeader
        title="Kit de interface"
        description="Os dois kits lado a lado, já com as cores do aura-fit. Use esta página para avaliar o visual antes do desenvolvimento."
      />

      <Section title="Cores" description="Um só conjunto de tokens (src/index.css) alimenta o shadcn/ui e o affectUI, no claro e no escuro." className="mb-6">
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {SWATCHES.map(([token, name]) => (
            <li key={token} className="grid gap-1.5">
              <span className="h-12 rounded-lg border" style={{ background: `var(--${token})` }} />
              <span className="text-xs leading-tight font-medium">{name}</span>
              <code className="text-[11px] leading-tight text-muted-foreground">--{token}</code>
            </li>
          ))}
        </ul>
      </Section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="affectUI (itens gratuitos)" description="Em src/components/affect. Cada item é um arquivo só, com estilo e movimento próprios.">
          <Row label="Botão">
            <AButton icon={<Plus />}>Principal</AButton>
            <AButton variant="secondary">Secundário</AButton>
            <AButton variant="ghost">Discreto</AButton>
            <AButton variant="destructive">Excluir</AButton>
            <AButton
              loading={loading}
              variant="secondary"
              onClick={() => {
                setLoading(true)
                setTimeout(() => setLoading(false), 1800)
              }}
            >
              {loading ? 'Salvando' : 'Testar carregamento'}
            </AButton>
          </Row>
          <Row label="Campo de texto">
            <TextField label="Nome" placeholder="Como quer ser chamado" hint="Aparece para seus alunos." className="w-64" />
            <TextField label="E-mail" defaultValue="carla@" error="Digite um e-mail completo." className="w-64" />
          </Row>
          <Row label="Busca e seleção">
            <TextField aria-label="Buscar" placeholder="Buscar" prefix={<Search className="size-4" />} clearable className="w-56" />
            <Select
              aria-label="Modo"
              defaultValue="remoto"
              className="w-48"
              options={[
                { value: 'remoto', label: 'Remoto', description: 'Acompanha pelo app' },
                { value: 'presencial', label: 'Presencial', description: 'Treina com você' },
              ]}
            />
          </Row>
          <Row label="Alternar visão">
            <SegmentedControl
              aria-label="Exemplo de visão"
              options={[
                { value: 'a', label: 'Ativos', count: 18 },
                { value: 'b', label: 'Pendentes', count: 2 },
                { value: 'c', label: 'Histórico' },
              ]}
            />
            <SegmentedControl
              variant="underline"
              aria-label="Exemplo de abas"
              options={[
                { value: 'a', label: 'Resumo' },
                { value: 'b', label: 'Saúde' },
                { value: 'c', label: 'Anotações' },
              ]}
            />
          </Row>
          <Row label="Marcar e ligar">
            <Checkbox label="Lembrar de mim" defaultChecked />
            <Switch label="Avisos de treino" defaultChecked />
            <div className="w-full sm:w-72">
              <Checkbox variant="card" label="Supino reto" description="3 séries · 10 repetições" />
            </div>
          </Row>
          <Row label="Carregando">
            <ThinkingLoader phases={['Lendo o histórico', 'Montando a semana']} loop />
            <ShimmerText>Buscando alunos</ShimmerText>
            <ASkeleton width={120} height={12} />
          </Row>
          <Row label="Filtros">
            <FilterMenu
              title="Filtros"
              defaultValue={{ modo: ['remoto'] }}
              groups={[
                { id: 'modo', label: 'Modo', options: [{ id: 'remoto', label: 'Remoto' }, { id: 'presencial', label: 'Presencial' }] },
                { id: 'alertas', label: 'Alertas', options: [{ id: 'com', label: 'Com alerta' }, { id: 'sem', label: 'Sem alerta' }] },
              ]}
            />
          </Row>
          <Row label="Avisos em pilha">
            <NotificationStack
              notices={[
                { id: '1', badge: 'Novo', title: 'Sugestões de treino com IA', text: 'Monte um rascunho em segundos e revise antes de enviar.', action: { label: 'Experimentar' }, pattern: 'orbit' },
                { id: '2', badge: 'Aviso', title: 'Renovação em 03/11', text: 'Confira o cartão para evitar falha na cobrança.', pattern: 'grid' },
              ]}
            />
          </Row>
          <Row label="Dicas">
            <TipsPanel
              title="Dicas rápidas"
              tips={[
                { id: 't1', title: 'Treino modelo', description: 'Monte uma vez e reutilize com vários alunos.', action: 'Criar modelo', doneLabel: 'Criado', primary: true },
                { id: 't2', title: 'Questionário semanal', description: 'Saiba como o aluno está sem precisar perguntar.', action: 'Ativar', doneLabel: 'Ativado' },
              ]}
            />
          </Row>
        </Section>

        <Section title="shadcn/ui" description="Em src/components/ui. Base para layout, navegação, tabelas, diálogos e gráficos." className="self-start">
          <Row label="Botão">
            <Button>Principal</Button>
            <Button variant="outline">Contorno</Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="ghost">Discreto</Button>
            <Button variant="destructive">Excluir</Button>
          </Row>
          <Row label="Campo">
            <div className="grid w-64 gap-1.5">
              <Label htmlFor="ds-nome">Nome</Label>
              <Input id="ds-nome" placeholder="Como quer ser chamado" />
            </div>
          </Row>
          <Row label="Etiquetas">
            <Badge>Padrão</Badge>
            <Badge variant="secondary">Secundária</Badge>
            <Badge variant="outline">Contorno</Badge>
            <Pill tone="success">Saúde liberada</Pill>
            <Pill tone="warning">1 alerta</Pill>
            <Pill tone="info">Rascunho</Pill>
          </Row>
          <Row label="Abas">
            <Tabs defaultValue="a" className="w-full">
              <TabsList>
                <TabsTrigger value="a">Resumo</TabsTrigger>
                <TabsTrigger value="b">Saúde</TabsTrigger>
              </TabsList>
              <TabsContent value="a" className="text-sm text-muted-foreground">
                Conteúdo da aba Resumo.
              </TabsContent>
              <TabsContent value="b" className="text-sm text-muted-foreground">
                Conteúdo da aba Saúde.
              </TabsContent>
            </Tabs>
          </Row>
          <Row label="Progresso">
            <Progress value={60} className="h-2 w-64" aria-label="Exemplo de progresso" />
          </Row>
          <Row label="Aviso">
            <Alert>
              <AlertTitle>Você está perto do limite do plano</AlertTitle>
              <AlertDescription>Seu plano permite 30 alunos e você já tem 28.</AlertDescription>
            </Alert>
          </Row>
          <Row label="Diálogo e dica">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Abrir diálogo</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Encerrar acompanhamento?</DialogTitle>
                  <DialogDescription>O aluno perde o acesso aos treinos. O histórico fica guardado e você pode reativar depois.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button variant="destructive">Encerrar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost">Passe o mouse</Button>
              </TooltipTrigger>
              <TooltipContent>Explicação curta</TooltipContent>
            </Tooltip>
          </Row>
        </Section>
      </div>
    </>
  )
}
