import { ChartSpline, Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { NumberTicker } from '@/components/affect/number-ticker'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { BarsChart } from '@/components/charts/bars-chart'
import { ChartCard } from '@/components/charts/chart-card'
import { HBars } from '@/components/charts/h-bars'
import { MiniBars } from '@/components/charts/mini-bars'
import { Sparkline } from '@/components/charts/sparkline'
import { TrendChart } from '@/components/charts/trend-chart'
import { Pill } from '@/components/page'
import { EmptyState, ErrorState, ListSkeleton } from '@/components/states'
import { brl } from '@/lib/data'
import { decimal } from '@/lib/format'
import { adherenceByPlan, avgByWeekday, reportBreakdown, reports, type ReportPeriod } from '@/lib/reports'
import { useLoad } from '@/lib/use-load'
import { cn } from '@/lib/utils'

const money = { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 } as const
const brl0 = (v: number) => v.toLocaleString('pt-BR', money)
/* espaço que não quebra: o recharts parte o rótulo do eixo em qualquer espaço comum */
const compact = (v: number) => (v >= 1000 ? `${decimal(v / 1000, v % 1000 ? 1 : 0)}\u00a0mil` : String(v))
const DELTA_TONE = { good: 'success', bad: 'danger', neutral: 'neutral' } as const
const WEEKDAY: Record<string, string> = { Seg: 'Segunda-feira', Ter: 'Terça-feira', Qua: 'Quarta-feira', Qui: 'Quinta-feira', Sex: 'Sexta-feira', Sáb: 'Sábado', Dom: 'Domingo' }

/* Relatórios do personal: números do período, tendência contra o período anterior e onde está a adesão. */
export function Reports() {
  const { state, empty, retry } = useLoad()
  const [period, setPeriod] = useState<ReportPeriod>('semanas')
  const r = reports[period]
  const unit = period === 'semanas' ? 'Semana de' : 'Mês de'
  const total = r.trend.reduce((a, p) => a + p.atual, 0)
  const before = r.trend.reduce((a, p) => a + p.anterior, 0)
  const best = [...avgByWeekday].sort((a, b) => b.treinos - a.treinos)[0]

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl<ReportPeriod>
          aria-label="Período do relatório"
          size="sm"
          value={period}
          onChange={setPeriod}
          options={[
            { value: 'semanas', label: '8 semanas' },
            { value: 'meses', label: '6 meses' },
          ]}
        />
        <Button variant="secondary" size="sm" icon={<Download />} disabled={state !== 'pronto' || empty} onClick={() => toast.success('Relatório exportado', { description: `${r.label}, em planilha.` })}>
          Exportar
        </Button>
      </div>

      {state === 'carregando' && <ListSkeleton label="Carregando os relatórios" />}
      {state === 'erro' && <ErrorState what="os relatórios" onRetry={retry} />}
      {state === 'pronto' && empty && <EmptyState icon={<ChartSpline />} title="Ainda sem dados para relatório" text="Os gráficos aparecem quando seus alunos concluírem os primeiros treinos." />}
      {state === 'pronto' && !empty && (
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {r.kpis.map((k) => (
              <div key={k.id} className="min-w-0 rounded-xl border bg-card p-4 sm:p-5">
                <p className="truncate text-sm text-muted-foreground">{k.label}</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-2xl font-semibold tracking-tight tabular-nums">
                      {k.id === 'receita' ? <NumberTicker value={k.value} locale="pt-BR" format={money} /> : <NumberTicker value={k.value} />}
                      {k.id === 'adesao' && '%'}
                    </p>
                    <Pill tone={DELTA_TONE[k.delta.tone]} className="mt-2">
                      {k.delta.text}
                    </Pill>
                  </div>
                  <MiniBars data={k.bars} label={k.label} format={k.id === 'receita' ? brl0 : k.id === 'adesao' ? (v) => `${v}%` : String} className="hidden sm:flex" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard
              label="Treinos concluídos"
              value={<NumberTicker value={total} />}
              delta={{ text: `+${total - before}`, tone: 'good' }}
              footer={r.versus}
              className="lg:col-span-2"
            >
              <TrendChart
                key={period}
                data={r.trend}
                xKey="ponto"
                tipTitle={(l) => `${unit} ${l}`}
                series={[
                  { key: 'atual', label: 'Este período' },
                  { key: 'anterior', label: 'Período anterior', color: 'var(--chart-1)', muted: true },
                ]}
              />
            </ChartCard>

            <ChartCard label="Resumo do período" hint={reports.semanas.label}>
              <ul className="-mx-2 grid">
                {reportBreakdown.map((b, i) => (
                  <li key={b.id} className={cn('flex items-center gap-3 rounded-lg px-2 py-2 text-sm', i % 2 === 1 && 'bg-muted/60')}>
                    <span className="min-w-0 flex-1 truncate text-muted-foreground">{b.label}</span>
                    <span className="font-medium tabular-nums">{b.value}</span>
                    <Sparkline data={b.spark} tone={b.tone} />
                  </li>
                ))}
              </ul>
            </ChartCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard label="Adesão por plano" hint="Treinos feitos sobre os planejados">
              <HBars max={100} format={(v) => `${v}%`} rows={adherenceByPlan.map((a) => ({ id: a.id, label: a.plan, sub: `${a.students} alunos`, value: a.pct }))} />
            </ChartCard>

            <ChartCard label="Dia mais forte" value={WEEKDAY[best.dia]} hint={`${decimal(best.treinos)} treinos em média`} footer="Média de treinos por dia da semana">
              <BarsChart data={avgByWeekday} xKey="dia" yKey="treinos" label="Treinos em média" format={(v) => decimal(v)} axisFormat={(v) => decimal(v, 0)} tipTitle={(l) => WEEKDAY[l] ?? l} height="h-44" />
            </ChartCard>

            <ChartCard
              label="Receita recebida"
              value={<NumberTicker value={r.kpis[3].value} locale="pt-BR" format={money} />}
              delta={r.kpis[3].delta}
              footer="Mensalidades confirmadas em Cobranças"
            >
              <TrendChart
                key={period}
                area
                data={r.revenue}
                xKey="ponto"
                format={brl}
                axisFormat={compact}
                axisWidth={52}
                tipTitle={(l) => `${unit} ${l}`}
                reference={{ y: r.revenueGoal, label: `Meta ${brl0(r.revenueGoal)}` }}
                series={[{ key: 'recebido', label: 'Recebido' }]}
                height="h-44"
              />
            </ChartCard>
          </div>
        </div>
      )}
    </>
  )
}
