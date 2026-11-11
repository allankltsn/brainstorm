import { ArrowLeft, ClipboardList, Dumbbell, History, Link2, MessageSquare, NotebookPen, Ruler, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { TextArea } from '@/components/affect/text-area'
import { PageHeader, Section } from '@/components/page'
import { EmptyState, ErrorState, ListSkeleton } from '@/components/states'
import { firstName, students } from '@/lib/data'
import { monthLong } from '@/lib/format'
import { timeline, type TimelineEvent, type TimelineKind } from '@/lib/progress'
import { useLoad } from '@/lib/use-load'
import { cn } from '@/lib/utils'
import { NaoEncontrada } from '@/pages/nao-encontrada'

type Filter = 'tudo' | 'treinos' | 'saude' | 'anotacoes'

const KIND: Record<TimelineKind, { icon: LucideIcon; label: string; tone: string }> = {
  treino: { icon: Dumbbell, label: 'Treino', tone: 'bg-success-soft text-success' },
  checkin: { icon: Ruler, label: 'Check-in', tone: 'bg-info-soft text-info' },
  questionario: { icon: ClipboardList, label: 'Questionário', tone: 'bg-info-soft text-info' },
  mensagem: { icon: MessageSquare, label: 'Mensagem', tone: 'bg-muted text-muted-foreground' },
  anotacao: { icon: NotebookPen, label: 'Anotação', tone: 'bg-warning-soft text-warning' },
  vinculo: { icon: Link2, label: 'Acompanhamento', tone: 'bg-muted text-muted-foreground' },
}

const FILTERS: Record<Filter, TimelineKind[] | null> = {
  tudo: null,
  treinos: ['treino'],
  saude: ['checkin', 'questionario'],
  anotacoes: ['anotacao'],
}

const TODAY = '2026-10-16'

export function AlunoLinhaDoTempo() {
  const { id } = useParams()
  const s = students.find((x) => x.id === id)
  const { state, empty, retry } = useLoad()
  const [events, setEvents] = useState<TimelineEvent[]>(timeline)
  const [filter, setFilter] = useState<Filter>('tudo')
  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState<string>()
  const [saving, setSaving] = useState(false)
  if (!s) return <NaoEncontrada />

  const kinds = FILTERS[filter]
  const list = (empty ? [] : events).filter((e) => !kinds || kinds.includes(e.kind))
  const months = [...new Set(list.map((e) => e.date.slice(0, 7)))]

  function save() {
    if (!note.trim()) return setNoteError('Escreva a anotação antes de salvar.')
    setNoteError(undefined)
    setSaving(true)
    setTimeout(() => {
      setEvents((l) => [{ id: `n${l.length}`, date: TODAY, time: 'agora', kind: 'anotacao', title: 'Anotação', detail: note.trim() }, ...l])
      setNote('')
      setSaving(false)
      toast.success('Anotação salva na linha do tempo')
    }, 600)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to={`/alunos/${s.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {s.name}
      </Link>
      <PageHeader title="Linha do tempo" description={`Tudo o que aconteceu com ${firstName(s.name)}, do mais recente ao mais antigo.`} />

      <Section title="Nova anotação" description="Só você vê. Fica guardada na linha do tempo." className="mb-6">
        <TextArea
          label="Anotação"
          placeholder="Ex.: pediu para evitar agachamento esta semana"
          minRows={2}
          maxRows={6}
          maxLength={500}
          counter
          value={note}
          onChange={(e) => setNote(e.target.value)}
          error={noteError}
          hint="Evite dados de saúde aqui. Use a aba Saúde do aluno."
          onSubmitShortcut={save}
        />
        <div className="mt-4 flex justify-end">
          <Button loading={saving} onClick={save}>
            {saving ? 'Salvando' : 'Salvar anotação'}
          </Button>
        </div>
      </Section>

      <SegmentedControl<Filter>
        aria-label="Filtrar a linha do tempo"
        value={filter}
        onChange={setFilter}
        className="mb-4"
        options={[
          { value: 'tudo', label: 'Tudo' },
          { value: 'treinos', label: 'Treinos' },
          { value: 'saude', label: 'Check-ins e respostas' },
          { value: 'anotacoes', label: 'Anotações' },
        ]}
      />

      {state === 'carregando' && <ListSkeleton label="Carregando a linha do tempo" />}
      {state === 'erro' && <ErrorState what="a linha do tempo" onRetry={retry} />}
      {state === 'pronto' && list.length === 0 && (
        <EmptyState
          icon={<History />}
          title="Nada por aqui ainda"
          text={filter === 'tudo' ? `Quando ${firstName(s.name)} treinar, responder ou fizer check-in, aparece aqui.` : 'Nenhum registro deste tipo. Veja tudo para conferir os outros.'}
          action={
            filter !== 'tudo' ? (
              <Button variant="secondary" onClick={() => setFilter('tudo')}>
                Ver tudo
              </Button>
            ) : undefined
          }
        />
      )}
      {state === 'pronto' &&
        months.map((m) => (
          <section key={m} className="mb-6">
            <h2 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">{monthLong(`${m}-01`)}</h2>
            <ol className="relative grid gap-4 before:absolute before:top-2 before:bottom-2 before:left-4 before:w-px before:bg-border">
              {list
                .filter((e) => e.date.startsWith(m))
                .map((e) => {
                  const k = KIND[e.kind]
                  return (
                    <li key={e.id} className="relative flex gap-3">
                      <span className={cn('z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-background', k.tone)}>
                        <k.icon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1 rounded-xl border bg-card px-4 py-3">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <p className="text-sm font-medium">{e.title}</p>
                          <p className="text-xs text-muted-foreground tabular-nums">
                            <span className="sr-only">{k.label}, </span>
                            {e.date.slice(8)}/{e.date.slice(5, 7)}
                            {e.time ? ` · ${e.time}` : ''}
                          </p>
                        </div>
                        {e.detail && <p className="mt-1 text-sm text-muted-foreground">{e.detail}</p>}
                        {e.to && (
                          <Link to={e.to} className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-brand-text underline-offset-4 hover:underline sm:min-h-0">
                            Abrir
                          </Link>
                        )}
                      </div>
                    </li>
                  )
                })}
            </ol>
          </section>
        ))}
    </div>
  )
}
