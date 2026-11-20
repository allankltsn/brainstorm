import { ArrowUpRight, Monitor } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { Button } from '@/components/affect/button'
import { applications, getJob, APP_STATUS_LABEL, type AppStatus } from '@/lib/data'

const STATUS_STYLE: Record<AppStatus, string> = {
  preenchendo: 'bg-info-soft text-info',
  revisar: 'bg-warning-soft text-warning',
  enviada: 'bg-success-soft text-success',
  travou: 'bg-destructive/15 text-destructive',
}

function abrirAplicacao(id: string) {
  const u = new URL(window.location.href)
  u.hash = `/revisao/${id}`
  window.open(u.toString(), '_blank', 'noopener')
}

function acao(status: AppStatus, jobId: string) {
  if (status === 'enviada') return null
  if (status === 'travou')
    return (
      <Button size="sm" variant="secondary" icon={<Monitor size={15} />} onClick={() => abrirAplicacao(jobId)}>
        Resolver
      </Button>
    )
  return (
    <Button size="sm" variant={status === 'revisar' ? 'primary' : 'secondary'} iconRight={<ArrowUpRight size={15} />} onClick={() => abrirAplicacao(jobId)}>
      {status === 'revisar' ? 'Revisar' : 'Continuar'}
    </Button>
  )
}

export function Candidaturas() {
  return (
    <div>
      <PageHeader title="Candidaturas" subtitle="O que está em andamento e o que já saiu." />
      <div className="space-y-3">
        {applications.map((a) => {
          const job = getJob(a.jobId)
          if (!job) return null
          return (
            <div key={a.id} className="flex items-center gap-3 rounded-xl border bg-card p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[a.status]}`}>
                    {APP_STATUS_LABEL[a.status]}
                  </span>
                  <span className="text-xs text-muted-foreground">{a.when}</span>
                </div>
                <h3 className="mt-1.5 truncate text-sm font-medium">{job.title}</h3>
                <p className="truncate text-sm text-muted-foreground">
                  {job.company} · {job.ats}
                </p>
              </div>
              {acao(a.status, a.jobId)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
