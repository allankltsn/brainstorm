import { Link2, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { Select } from '@/components/affect/select'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Section } from '@/components/page'
import { Progress } from '@/components/ui/progress'
import { activeStudents, STUDENT_LIMIT, students } from '@/lib/data'

export function ConvidarAluno() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mode, setMode] = useState<string | null>('Remoto')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [loading, setLoading] = useState(false)
  const used = activeStudents().length
  const full = used >= STUDENT_LIMIT

  function submit(e: FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'Digite o nome do aluno.'
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Digite um e-mail válido, como nome@exemplo.com.br.'
    else if (students.some((s) => s.email === email.trim().toLowerCase())) next.email = 'Este e-mail já foi convidado.'
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    setTimeout(() => {
      toast.success('Convite enviado', { description: `${name.split(' ')[0]} receberá um e-mail com o link.` })
      navigate('/alunos')
    }, 800)
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Convidar aluno" description="O aluno recebe um link por e-mail e escolhe liberar os dados de saúde." />
      <div className="mb-6 rounded-xl border bg-card p-4">
        <div className="mb-1.5 flex justify-between text-sm">
          <span>Vagas do plano</span>
          <span className="text-muted-foreground">
            {used} de {STUDENT_LIMIT} em uso
          </span>
        </div>
        <Progress value={(used / STUDENT_LIMIT) * 100} className="h-2" aria-label={`${used} de ${STUDENT_LIMIT} vagas usadas`} />
        {full && <p className="mt-2 text-sm text-destructive">Limite atingido. Mude de plano para convidar mais alunos.</p>}
      </div>
      <form onSubmit={submit} noValidate>
        <Section title="Dados do aluno">
          <div className="grid gap-5">
            <TextField label="Nome completo" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
            <TextField label="E-mail" type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
            <Select
              label="Como você vai acompanhar"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'Remoto', label: 'Remoto', description: 'O aluno treina por conta própria pelo app.' },
                { value: 'Presencial', label: 'Presencial', description: 'Você acompanha o treino ao vivo.' },
              ]}
            />
          </div>
        </Section>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            icon={<Link2 />}
            onClick={() => {
              void navigator.clipboard?.writeText('https://aura-fit.exemplo/#/convite/abc123')
              toast.success('Link copiado')
            }}
          >
            Copiar link
          </Button>
          <Button type="submit" icon={<Send />} loading={loading} disabled={full}>
            {loading ? 'Enviando' : 'Enviar convite'}
          </Button>
        </div>
      </form>
    </div>
  )
}
