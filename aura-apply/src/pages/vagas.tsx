import { useMemo, useState } from 'react'
import { ArrowUpRight, ExternalLink, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { FitBadge, Chip } from '@/components/bits'
import { Button } from '@/components/affect/button'
import { TextField } from '@/components/affect/text-field'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { jobs, jobDetail, MODE_LABEL, type Fit, type Job } from '@/lib/data'

type Filtro = 'todas' | Fit

const fmtData = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

/** Abre a candidatura numa segunda aba, em tela cheia (fora do shell). */
function abrirAplicacao(id: string) {
  const u = new URL(window.location.href)
  u.hash = `/revisao/${id}`
  window.open(u.toString(), '_blank', 'noopener')
}

function JobCard({ job, onOpen }: { job: Job; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full rounded-xl border bg-card p-4 text-left transition hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-medium text-card-foreground">{job.title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{job.company}</p>
        </div>
        <FitBadge fit={job.fit} />
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{job.why}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Chip>
          <MapPin size={12} className="mr-1" />
          {MODE_LABEL[job.workMode]}
        </Chip>
        <Chip>{job.ats}</Chip>
        <span className="ml-auto text-xs text-muted-foreground">{fmtData(job.postedAt)}</span>
      </div>
    </button>
  )
}

function Detalhe({ job }: { job: Job }) {
  const d = jobDetail(job)
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <FitBadge fit={job.fit} />
          <Chip>{MODE_LABEL[job.workMode]}</Chip>
          <Chip>{job.location}</Chip>
          <Chip>via {job.source}</Chip>
        </div>

        <section>
          <h4 className="mb-1.5 text-sm font-medium text-foreground">Sobre a empresa</h4>
          <p className="text-sm text-muted-foreground">{d.companyAbout}</p>
        </section>

        <section>
          <h4 className="mb-1.5 text-sm font-medium text-foreground">A vaga</h4>
          <div className="space-y-2">
            {d.description.map((p, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </section>

        <section>
          <h4 className="mb-1.5 text-sm font-medium text-foreground">Requisitos</h4>
          <ul className="space-y-1.5">
            {d.requirements.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" />
                {r}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex items-center justify-between rounded-lg bg-muted px-3 py-2.5">
          <span className="text-sm text-muted-foreground">Salário</span>
          <span className="text-sm font-medium text-foreground">{job.salary ?? 'Não informado'}</span>
        </section>

        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Ver anúncio original <ExternalLink size={14} />
        </a>
      </div>

      <div className="border-t bg-card p-4">
        <Button className="w-full" size="lg" iconRight={<ArrowUpRight size={18} />} onClick={() => abrirAplicacao(job.id)}>
          Aplicar
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Abre a candidatura preenchida numa nova aba, para você revisar.
        </p>
      </div>
    </div>
  )
}

export function Vagas() {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [aberta, setAberta] = useState<Job | null>(null)
  const isMobile = useIsMobile()

  const contagem = useMemo(
    () => ({
      todas: jobs.length,
      alta: jobs.filter((j) => j.fit === 'alta').length,
      media: jobs.filter((j) => j.fit === 'media').length,
      baixa: jobs.filter((j) => j.fit === 'baixa').length,
    }),
    [],
  )

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return jobs.filter((j) => {
      if (filtro !== 'todas' && j.fit !== filtro) return false
      if (!q) return true
      return (j.title + ' ' + j.company).toLowerCase().includes(q)
    })
  }, [busca, filtro])

  return (
    <div>
      <PageHeader title="Vagas para você" subtitle={`${jobs.length} vagas selecionadas pelo seu perfil`} />

      <div className="mb-4 space-y-3">
        <TextField
          placeholder="Buscar por cargo ou empresa"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          clearable
          onClear={() => setBusca('')}
        />
        <SegmentedControl<Filtro>
          fullWidth
          value={filtro}
          onChange={setFiltro}
          options={[
            { value: 'todas', label: 'Todas', count: contagem.todas },
            { value: 'alta', label: 'Alta', count: contagem.alta },
            { value: 'media', label: 'Média', count: contagem.media },
            { value: 'baixa', label: 'Baixa', count: contagem.baixa },
          ]}
        />
      </div>

      {lista.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nenhuma vaga com esses filtros. Ajuste a busca ou o nível de compatibilidade.
        </p>
      ) : (
        <div className="space-y-3">
          {lista.map((job) => (
            <JobCard key={job.id} job={job} onOpen={() => setAberta(job)} />
          ))}
        </div>
      )}

      <Sheet open={!!aberta} onOpenChange={(o) => !o && setAberta(null)}>
        <SheetContent
          side={isMobile ? 'bottom' : 'right'}
          className={isMobile ? 'h-[88dvh] p-0 sm:max-w-none' : 'w-full gap-0 p-0 sm:max-w-md'}
        >
          {aberta && (
            <>
              <SheetHeader className="pr-12">
                <SheetTitle>{aberta.title}</SheetTitle>
                <p className="text-sm text-muted-foreground">{aberta.company}</p>
              </SheetHeader>
              <Detalhe job={aberta} />
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
