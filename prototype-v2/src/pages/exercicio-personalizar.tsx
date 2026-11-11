import { ArrowLeft } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { TextArea } from '@/components/affect/text-area'
import { TextField } from '@/components/affect/text-field'
import { ExerciseThumb } from '@/components/exercise-thumb'
import { PageHeader, Section } from '@/components/page'
import { findExercise } from '@/lib/training'
import { NaoEncontrada } from '@/pages/nao-encontrada'

export function ExercicioPersonalizar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const e = findExercise(id)
  const [name, setName] = useState(e ? `${e.name} (minha versão)` : '')
  const [error, setError] = useState<string>()
  const [saving, setSaving] = useState(false)
  if (!e) return <NaoEncontrada />

  function submit(ev: FormEvent) {
    ev.preventDefault()
    if (!name.trim()) return setError('Dê um nome à sua versão.')
    setSaving(true)
    setTimeout(() => {
      toast.success('Sua versão foi criada', { description: 'Ela aparece na sua biblioteca, só para você.' })
      navigate('/treinos?aba=exercicios')
    }, 800)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to={`/treinos/exercicios/${e.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {e.name}
      </Link>
      <PageHeader title="Criar minha versão" description="Você copia o exercício e muda o que quiser. O original continua igual." />
      <form onSubmit={submit} noValidate className="grid gap-6">
        <Section title="Baseado em">
          <div className="flex items-center gap-4">
            <div className="w-24 shrink-0">
              <ExerciseThumb exercise={e} />
            </div>
            <p className="text-sm">
              <span className="font-medium">{e.name}</span>
              <span className="block text-muted-foreground">
                {e.group} · {e.equipment}
              </span>
            </p>
          </div>
        </Section>
        <Section title="O que muda na sua versão">
          <div className="grid gap-5">
            <TextField label="Nome" value={name} onChange={(ev) => setName(ev.target.value)} error={error} />
            <TextField label="Equipamento" defaultValue={e.equipment} />
            <TextArea label="Como fazer" defaultValue={e.steps.join('\n')} minRows={4} hint="Um passo por linha." />
            <TextArea label="Cuidados" optional defaultValue={e.tips.join('\n')} minRows={2} />
          </div>
        </Section>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate(`/treinos/exercicios/${e.id}`)}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {saving ? 'Criando' : 'Criar minha versão'}
          </Button>
        </div>
      </form>
    </div>
  )
}
