import { Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Section } from '@/components/page'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useContent, whenLabel } from '@/lib/content'
import { brl, SOURCES, STAGES, TODAY, useCrm, type Source } from '@/lib/crm'
import { AI_CREDITS } from '@/lib/data'

type Period = '7' | '30' | '90'
const pct = (n: number, of: number) => (of ? `${Math.round((n / of) * 100)}%` : 'sem dados')

function Stat({ label, value, foot }: { label: string; value: string; foot?: string }) {
  return (
    <div className="min-w-0 rounded-xl border bg-card p-4 sm:p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{value}</p>
      {foot && <p className="mt-2 text-xs text-muted-foreground">{foot}</p>}
    </div>
  )
}

/* Painel da marca: resultados do período, calculados a partir dos contatos, posts e campanhas do app. */
export function Relatorios() {
  const { contacts, deals, campaigns } = useCrm()
  const { published, scheduled, failed } = useContent()
  const [period, setPeriod] = useState<Period>('30')
  const from = new Date(`${TODAY}T00:00`)
  from.setDate(from.getDate() - Number(period) + 1)
  const since = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}-${String(from.getDate()).padStart(2, '0')}`
  // contatos que chegaram no período e os negócios deles
  const inPeriod = contacts.filter((x) => x.createdAt >= since)
  const ids = new Set(inPeriod.map((x) => x.id))
  const periodDeals = deals.filter((d) => ids.has(d.contactId))
  const won = periodDeals.filter((d) => d.stage === 'ganho')
  const lost = periodDeals.filter((d) => d.stage === 'perdido')
  const open = periodDeals.filter((d) => d.stage === 'conversa' || d.stage === 'proposta')
  const sum = (list: typeof deals) => list.reduce((n, d) => n + d.value, 0)
  const bySource = (Object.keys(SOURCES) as Source[])
    .map((s) => {
      const people = new Set(inPeriod.filter((x) => x.source === s).map((x) => x.id))
      const closed = won.filter((d) => people.has(d.contactId))
      return { source: SOURCES[s], contacts: people.size, closed: closed.length, value: sum(closed) }
    })
    .filter((r) => r.contacts > 0)
    .sort((a, b) => b.contacts - a.contacts)
  const stageMax = Math.max(1, ...STAGES.map((s) => periodDeals.filter((d) => d.stage === s.id).length))
  const sent = campaigns.filter((g) => g.status === 'enviada' && g.when.slice(0, 10) >= since)
  const pubs = published.filter((p) => (p.publishedAt ?? p.when).slice(0, 10) >= since)
  const creditMax = Math.max(...AI_CREDITS.byFeature.map((f) => f.used))

  const exportCsv = () => {
    const rows = [['Origem', 'Contatos', 'Fechados', 'Valor fechado (R$)'], ...bySource.map((r) => [r.source, r.contacts, r.closed, r.value])]
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n')
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `aura-brand-origens-${period}-dias.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Relatório baixado', { description: `Origens dos contatos, últimos ${period} dias.` })
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl<Period>
          aria-label="Período do relatório"
          value={period}
          onChange={setPeriod}
          options={[
            { value: '7', label: '7 dias' },
            { value: '30', label: '30 dias' },
            { value: '90', label: '90 dias' },
          ]}
        />
        <Button variant="secondary" icon={<Download />} onClick={exportCsv} disabled={bySource.length === 0}>
          Baixar origens em CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="Contatos novos" value={String(inPeriod.length)} foot={`Desde ${since.slice(8, 10)}/${since.slice(5, 7)}`} />
        <Stat label="Taxa de fechamento" value={pct(won.length, won.length + lost.length)} foot={`${won.length} ${won.length === 1 ? 'fechado' : 'fechados'}, ${lost.length} ${lost.length === 1 ? 'perdido' : 'perdidos'}`} />
        <Stat label="Valor fechado" value={brl(sum(won))} />
        <Stat label="Em negociação" value={brl(sum(open))} foot={`${open.length} ${open.length === 1 ? 'negócio' : 'negócios'} em conversa ou proposta`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Section title="Funil" description="Onde estão os negócios dos contatos que chegaram no período." className="min-w-0">
          <ul className="grid gap-3.5">
            {STAGES.map((s) => {
              const n = periodDeals.filter((d) => d.stage === s.id).length
              return (
                <li key={s.id}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span>{s.label}</span>
                    <span className="text-muted-foreground tabular-nums">{n}</span>
                  </div>
                  <Progress value={(n / stageMax) * 100} className="h-1.5" aria-label={`${s.label}: ${n} negócios`} />
                </li>
              )
            })}
          </ul>
        </Section>

        <Section title="Créditos de IA" description={`${AI_CREDITS.used} de ${AI_CREDITS.total.toLocaleString('pt-BR')} usados neste mês. Renovam em 03/12.`} className="min-w-0">
          <ul className="grid gap-3.5">
            {AI_CREDITS.byFeature.map((f) => (
              <li key={f.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span>{f.label}</span>
                  <span className="text-muted-foreground tabular-nums">{f.used}</span>
                </div>
                <Progress value={(f.used / creditMax) * 100} className="h-1.5" aria-label={`${f.label}: ${f.used} créditos`} />
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Origem dos contatos" description="De onde vieram e quantos viraram clientes." className="mt-6">
        {bySource.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Nenhum contato chegou neste período. Tente um período maior.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Origem</TableHead>
                <TableHead className="text-right">Contatos</TableHead>
                <TableHead className="text-right">Fechados</TableHead>
                <TableHead className="text-right">Valor fechado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bySource.map((r) => (
                <TableRow key={r.source}>
                  <TableCell className="font-medium">{r.source}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.contacts}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.closed}</TableCell>
                  <TableCell className="text-right tabular-nums">{brl(r.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Section title="Conteúdo" description="Posts do período e o que está por vir." className="min-w-0">
          <dl className="grid grid-cols-3 gap-3">
            {[
              ['Publicados', pubs.length],
              ['Agendados', scheduled.length],
              ['Não publicados', failed.length],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border p-3">
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="mt-1 text-xl font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          {pubs.length > 0 && (
            <ul className="mt-4 grid gap-2 text-sm">
              {pubs.map((p) => (
                <li key={p.id} className="flex flex-wrap justify-between gap-x-3">
                  <span className="min-w-0 truncate">{p.headline}</span>
                  <span className="text-muted-foreground tabular-nums">{whenLabel(p.publishedAt ?? p.when)}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Campanhas enviadas" description="Abertura, cliques e respostas de cada envio." className="min-w-0">
          {sent.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma campanha enviada neste período.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead className="text-right">Enviadas</TableHead>
                  <TableHead className="text-right">Abertas</TableHead>
                  <TableHead className="text-right">Respostas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sent.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="max-w-40 truncate font-medium">{g.name}</TableCell>
                    <TableCell className="text-right tabular-nums">{g.sent}</TableCell>
                    <TableCell className="text-right tabular-nums">{g.opened + g.clicked + g.replied === 0 ? 'Aguardando' : pct(g.opened, g.sent)}</TableCell>
                    <TableCell className="text-right tabular-nums">{g.opened + g.clicked + g.replied === 0 ? 'Aguardando' : pct(g.replied, g.sent)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Section>
      </div>
    </>
  )
}
