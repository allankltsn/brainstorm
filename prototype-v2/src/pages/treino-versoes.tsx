import { ArrowLeft, History, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { PageHeader, Pill } from '@/components/page'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { workoutVersions } from '@/lib/extras'
import { workouts } from '@/lib/training'
import { NaoEncontrada } from '@/pages/nao-encontrada'

export function TreinoVersoes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const wk = workouts.find((w) => w.id === id)
  const [restore, setRestore] = useState<number>()
  if (!wk) return <NaoEncontrada />
  return (
    <div className="mx-auto max-w-2xl">
      <Link to={`/treinos/${wk.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {wk.name}
      </Link>
      <PageHeader title="Histórico de versões" description="Cada vez que você salva o treino, guardamos como ele estava." />
      <ol className="grid gap-3">
        {workoutVersions.map((v) => (
          <li key={v.v} className="rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm font-medium">
                <History className="size-4 text-muted-foreground" /> Versão {v.v}
                {v.current && <Pill tone="success">Atual</Pill>}
              </p>
              <p className="text-xs text-muted-foreground">
                {v.when} · {v.by}
              </p>
            </div>
            <ul className="mt-3 grid list-disc gap-1 pl-5 text-sm text-muted-foreground">
              {v.changes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {!v.current && (
              <Button size="sm" variant="secondary" icon={<RotateCcw />} className="mt-4" onClick={() => setRestore(v.v)}>
                Voltar para esta versão
              </Button>
            )}
          </li>
        ))}
      </ol>
      <Dialog open={restore !== undefined} onOpenChange={(o) => !o && setRestore(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Voltar para a versão {restore}?</DialogTitle>
            <DialogDescription>O treino atual vira uma nova versão no histórico, então nada se perde. Os alunos passam a ver a versão {restore}.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setRestore(undefined)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                toast.success(`Treino voltou para a versão ${restore}`)
                navigate(`/treinos/${wk.id}`)
              }}
            >
              Voltar para a versão {restore}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
