import { ArrowLeft, History, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { PageHeader, Pill } from '@/components/page'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { workoutVersions } from '@/lib/extras'
import { findTemplate, workouts } from '@/lib/training'
import { NaoEncontrada } from '@/pages/nao-encontrada'

export function TreinoVersoes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const wk = workouts.find((w) => w.id === id)
  const [restore, setRestore] = useState<number>()
  const [fromTpl, setFromTpl] = useState(false)
  if (!wk) return <NaoEncontrada />
  const tpl = findTemplate(wk.from)
  return (
    <div className="mx-auto max-w-2xl">
      <Link to={`/treinos/${wk.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {wk.name}
      </Link>
      <PageHeader title="Histórico de versões" description="Cada vez que você salva o treino, guardamos como ele estava." />
      {tpl && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
          <p className="grid text-sm">
            <span className="font-medium">Criado a partir do modelo pronto "{tpl.name}"</span>
            <span className="text-muted-foreground">Dá para desfazer todas as mudanças e voltar ao modelo original.</span>
          </p>
          <Button size="sm" variant="secondary" icon={<RotateCcw />} onClick={() => setFromTpl(true)}>
            Restaurar do modelo
          </Button>
        </div>
      )}
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
      <Dialog open={fromTpl} onOpenChange={setFromTpl}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restaurar do modelo "{tpl?.name}"?</DialogTitle>
            <DialogDescription>
              O treino volta a ter os exercícios, as séries e os descansos do modelo. Como ele está hoje fica guardado no histórico. {wk.students} {wk.students === 1 ? 'aluno passa' : 'alunos passam'} a ver o treino restaurado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setFromTpl(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                toast.success('Treino restaurado do modelo')
                navigate(`/treinos/${wk.id}`)
              }}
            >
              Restaurar do modelo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
