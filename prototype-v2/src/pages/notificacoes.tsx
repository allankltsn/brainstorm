import { BellOff, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { PageHeader } from '@/components/page'
import { notifications } from '@/lib/data'
import { cn } from '@/lib/utils'

type Filter = 'todas' | 'novas'

export function Notificacoes() {
  const [items, setItems] = useState(notifications)
  const [filter, setFilter] = useState<Filter>('todas')
  const unread = items.filter((n) => n.unread).length
  const list = filter === 'novas' ? items.filter((n) => n.unread) : items
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
          { value: 'todas', label: 'Todos', count: items.length },
          { value: 'novas', label: 'Novos', count: unread },
        ]}
      />
      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
          <BellOff className="size-8 text-muted-foreground" />
          <p className="font-medium">Nenhum aviso novo</p>
          <p className="text-sm text-muted-foreground">Quando algo acontecer com seus alunos, aparece aqui.</p>
        </div>
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
