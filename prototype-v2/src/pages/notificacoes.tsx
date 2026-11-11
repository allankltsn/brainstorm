import { BellOff, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { PageHeader } from '@/components/page'
import { EmptyState, ErrorState, ListSkeleton } from '@/components/states'
import { useLoad } from '@/lib/use-load'
import { notifications } from '@/lib/data'
import { cn } from '@/lib/utils'

type Filter = 'todas' | 'novas'

export function Notificacoes() {
  const { state, empty, retry } = useLoad()
  const [items, setItems] = useState(notifications)
  const [filter, setFilter] = useState<Filter>('todas')
  const all = empty ? [] : items
  const unread = all.filter((n) => n.unread).length
  const list = filter === 'novas' ? all.filter((n) => n.unread) : all
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Avisos"
        description={unread ? `${unread} ${unread === 1 ? 'aviso novo' : 'avisos novos'}.` : 'Tudo em dia.'}
        actions={
          <Button
            variant="secondary"
            icon={<CheckCheck />}
            disabled={!unread}
            onClick={() => {
              setItems((l) => l.map((n) => ({ ...n, unread: false })))
              toast.success('Todos marcados como lidos')
            }}
          >
            Marcar todos como lidos
          </Button>
        }
      />
      <SegmentedControl<Filter>
        aria-label="Filtrar avisos"
        value={filter}
        onChange={setFilter}
        className="mb-4"
        options={[
          { value: 'todas', label: 'Todos', count: all.length },
          { value: 'novas', label: 'Novos', count: unread },
        ]}
      />
      {state === 'carregando' ? (
        <ListSkeleton rows={3} label="Carregando seus avisos" />
      ) : state === 'erro' ? (
        <ErrorState what="seus avisos" onRetry={retry} />
      ) : list.length === 0 ? (
        <EmptyState icon={<BellOff />} title={all.length === 0 ? 'Nenhum aviso ainda' : 'Nenhum aviso novo'} text="Quando algo acontecer com seus treinos ou alunos, aparece aqui." />
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border bg-card">
          {list.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                className="flex min-h-11 w-full items-start gap-3 px-4 py-3.5 text-left hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                onClick={() => setItems((l) => l.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
              >
                <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', n.unread ? 'bg-primary' : 'bg-border')} />
                <span className="grid gap-0.5">
                  <span className={cn('text-sm', n.unread && 'font-medium')}>{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.when}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
