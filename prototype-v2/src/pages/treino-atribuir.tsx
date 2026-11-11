import { ArrowLeft, Search, UserX } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { Checkbox } from '@/components/affect/checkbox'
import { Select } from '@/components/affect/select'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Section } from '@/components/page'
import { activeStudents } from '@/lib/data'
import { workouts } from '@/lib/training'
import { NaoEncontrada } from '@/pages/nao-encontrada'

export function TreinoAtribuir() {
  const { id } = useParams()
  const navigate = useNavigate()
  const wk = workouts.find((w) => w.id === id)
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [start, setStart] = useState<string | null>('hoje')
  const [error, setError] = useState<string>()
  const [saving, setSaving] = useState(false)
  if (!wk) return <NaoEncontrada />
  const list = activeStudents().filter((s) => s.name.toLowerCase().includes(q.trim().toLowerCase()))
  const replacing = activeStudents().filter((s) => picked.includes(s.id) && s.plan).length

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/treinos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Treinos
      </Link>
      <PageHeader title={`Usar "${wk.name}" com alunos`} description="Cada aluno recebe uma cópia. Você pode ajustar a cópia sem mudar o modelo." />
      <Section title="Quem vai receber" description={`${picked.length} ${picked.length === 1 ? 'aluno escolhido' : 'alunos escolhidos'}.`}>
        <TextField aria-label="Buscar aluno pelo nome" placeholder="Buscar pelo nome" prefix={<Search className="size-4" />} clearable value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} />
        {error && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        )}
        {list.length === 0 ? (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center">
            <UserX className="size-7 text-muted-foreground" />
            <p className="text-sm font-medium">Nenhum aluno com esse nome</p>
            <Button size="sm" variant="secondary" onClick={() => setQ('')}>
              Limpar busca
            </Button>
          </div>
        ) : (
          <ul className="mt-4 grid max-h-80 gap-2 overflow-y-auto sm:grid-cols-2">
            {list.map((s) => (
              <li key={s.id}>
                <Checkbox
                  variant="card"
                  label={s.name}
                  description={s.plan ? `Hoje usa: ${s.plan}` : 'Sem treino'}
                  checked={picked.includes(s.id)}
                  onChange={(e) => setPicked((p) => (e.target.checked ? [...p, s.id] : p.filter((x) => x !== s.id)))}
                />
              </li>
            ))}
          </ul>
        )}
      </Section>
      <Section title="Quando começa" className="mt-6">
        <Select
          aria-label="Início do treino"
          className="sm:w-64"
          value={start}
          onChange={setStart}
          options={[
            { value: 'hoje', label: 'Hoje' },
            { value: 'segunda', label: 'Próxima segunda-feira' },
          ]}
        />
        {replacing > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            {replacing} {replacing === 1 ? 'aluno já tem treino, que será substituído' : 'alunos já têm treino, que será substituído'}. O histórico de treinos feitos é mantido.
          </p>
        )}
      </Section>
      <div className="mt-6 flex justify-end">
        <Button
          loading={saving}
          onClick={() => {
            if (!picked.length) return setError('Escolha pelo menos um aluno.')
            setSaving(true)
            setTimeout(() => {
              toast.success(`Treino enviado para ${picked.length} ${picked.length === 1 ? 'aluno' : 'alunos'}`)
              navigate('/treinos')
            }, 800)
          }}
        >
          {saving ? 'Enviando' : 'Enviar treino'}
        </Button>
      </div>
    </div>
  )
}
