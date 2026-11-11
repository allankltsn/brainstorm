import { ArrowLeft, Globe, Lock, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { PageHeader } from '@/components/page'
import { findExercise } from '@/lib/training'
import { cn } from '@/lib/utils'
import { NaoEncontrada } from '@/pages/nao-encontrada'

const OPTIONS = [
  { value: 'privado', label: 'Só eu', text: 'Aparece só na sua biblioteca.', icon: <Lock /> },
  { value: 'compartilhado', label: 'Personais que eu escolher', text: 'Outros personais podem usar, sem editar o original.', icon: <Users /> },
  { value: 'publico', label: 'Todos no aura-fit', text: 'Passa por uma revisão antes de aparecer para todos.', icon: <Globe /> },
] as const
type Value = (typeof OPTIONS)[number]['value']

export function ExercicioVisibilidade() {
  const { id } = useParams()
  const navigate = useNavigate()
  const e = findExercise(id)
  const [value, setValue] = useState<Value>('privado')
  if (!e) return <NaoEncontrada />
  return (
    <div className="mx-auto max-w-xl">
      <Link to={`/treinos/exercicios/${e.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {e.name}
      </Link>
      <PageHeader title="Quem pode ver este exercício" description="Vale para o exercício, o vídeo e as instruções." />
      <fieldset>
        <legend className="sr-only">Visibilidade</legend>
        <div className="grid gap-3">
          {OPTIONS.map((o) => (
            <label
              key={o.value}
              className={cn(
                'flex cursor-pointer items-start gap-4 rounded-xl border bg-card p-4 has-focus-visible:ring-2 has-focus-visible:ring-ring',
                value === o.value && 'border-primary ring-1 ring-primary',
              )}
            >
              <input type="radio" name="visibilidade" className="sr-only" checked={value === o.value} onChange={() => setValue(o.value)} />
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-4">{o.icon}</span>
              <span className="grid">
                <span className="text-sm font-medium">{o.label}</span>
                <span className="text-sm text-muted-foreground">{o.text}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {value !== 'privado' && <p className="mt-4 text-sm text-muted-foreground">Se você voltar para "Só eu" depois, quem já copiou o exercício mantém a cópia.</p>}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={() => navigate(`/treinos/exercicios/${e.id}`)}>
          Cancelar
        </Button>
        <Button
          onClick={() => {
            toast.success(value === 'publico' ? 'Enviado para revisão' : 'Visibilidade salva')
            navigate(`/treinos/exercicios/${e.id}`)
          }}
        >
          Salvar
        </Button>
      </div>
    </div>
  )
}
