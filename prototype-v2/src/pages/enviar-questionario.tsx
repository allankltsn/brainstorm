import { ArrowLeft, Send } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { Checkbox } from '@/components/affect/checkbox'
import { Select } from '@/components/affect/select'
import { PageHeader, Section } from '@/components/page'
import { activeStudents } from '@/lib/data'
import { formTemplates } from '@/lib/tracking'

export function EnviarQuestionario() {
  const navigate = useNavigate()
  const list = activeStudents()
  const [template, setTemplate] = useState<string | null>(null)
  const [picked, setPicked] = useState<string[]>([])
  const [deadline, setDeadline] = useState<string | null>('7')
  const [error, setError] = useState<{ template?: string; picked?: string }>({})
  const [sending, setSending] = useState(false)
  const all = picked.length === list.length

  function send() {
    const next: typeof error = {}
    if (!template) next.template = 'Escolha um questionário.'
    if (!picked.length) next.picked = 'Escolha pelo menos um aluno.'
    setError(next)
    if (Object.keys(next).length) return
    setSending(true)
    setTimeout(() => {
      toast.success(`Questionário enviado para ${picked.length} ${picked.length === 1 ? 'aluno' : 'alunos'}`)
      navigate('/acompanhamento?aba=questionarios')
    }, 800)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/acompanhamento?aba=questionarios" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Questionários
      </Link>
      <PageHeader title="Enviar questionário" description="O aluno responde pelo app e você é avisado." />
      <div className="grid gap-6">
        <Section title="1. Qual questionário" action={<Link to="/acompanhamento/questionarios/modelo" className="text-sm font-medium text-brand-text underline-offset-4 hover:underline">Criar modelo</Link>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Questionário"
              placeholder="Escolha um modelo"
              value={template}
              onChange={setTemplate}
              error={error.template}
              options={formTemplates.map((t) => ({ value: t.id, label: t.name, description: `${t.questions} perguntas · ${t.origin}` }))}
            />
            <Select
              label="Prazo para responder"
              value={deadline}
              onChange={setDeadline}
              options={[
                { value: '3', label: '3 dias' },
                { value: '7', label: '7 dias' },
                { value: '14', label: '14 dias' },
              ]}
            />
          </div>
        </Section>
        <Section title="2. Para quem" description={`${picked.length} de ${list.length} alunos escolhidos.`}>
          <Checkbox
            label="Todos os alunos ativos"
            checked={all}
            indeterminate={picked.length > 0 && !all}
            onChange={(e) => setPicked(e.target.checked ? list.map((s) => s.id) : [])}
            error={error.picked}
          />
          <ul className="mt-4 grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2">
            {list.map((s) => (
              <li key={s.id}>
                <Checkbox
                  variant="card"
                  label={s.name}
                  description={s.plan ?? 'Sem treino'}
                  checked={picked.includes(s.id)}
                  onChange={(e) => setPicked((p) => (e.target.checked ? [...p, s.id] : p.filter((x) => x !== s.id)))}
                />
              </li>
            ))}
          </ul>
        </Section>
      </div>
      <div className="mt-6 flex justify-end">
        <Button icon={<Send />} loading={sending} onClick={send}>
          {sending ? 'Enviando' : 'Enviar questionário'}
        </Button>
      </div>
    </div>
  )
}
