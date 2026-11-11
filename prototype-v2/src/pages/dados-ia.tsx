import { ArrowLeft, CheckCircle2, CircleDashed, CircleSlash } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader, Person, Pill, Section } from '@/components/page'
import { activeStudents } from '@/lib/data'
import { aiDataUsed } from '@/lib/tracking'

export function DadosIA() {
  const list = activeStudents()
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/ia" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Sugerir treino
      </Link>
      <PageHeader title="Dados usados pela IA" description="O que entra em cada sugestão e quais alunos liberaram esse uso." />
      <Section title="O que a IA recebe">
        <ul className="divide-y">
          {aiDataUsed.map((d) => (
            <li key={d.label} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
              <span className="grid min-w-0">
                <span className="text-sm font-medium">{d.label}</span>
                <span className="text-xs text-muted-foreground">{d.note}</span>
              </span>
              {d.used ? <Pill tone="info" icon={<CheckCircle2 />}>Usado</Pill> : <Pill icon={<CircleSlash />}>Não usado</Pill>}
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Liberação por aluno" description="Só o aluno pode liberar ou retirar. Sem liberação, a sugestão usa só o que você digitar." className="mt-6">
        <ul className="divide-y">
          {list.map((s, i) => {
            /* Fictício: a liberação de IA é simulada a partir da de saúde. */
            const ok = s.health === 'liberado' && i % 3 !== 0
            return (
              <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                <Link to={`/alunos/${s.id}`} className="min-w-0 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                  <Person name={s.name} sub={s.plan ?? 'Sem treino'} size="sm" />
                </Link>
                {ok ? <Pill tone="success" icon={<CheckCircle2 />}>IA liberada</Pill> : <Pill icon={<CircleDashed />}>Não liberada</Pill>}
              </li>
            )
          })}
        </ul>
      </Section>
    </div>
  )
}
