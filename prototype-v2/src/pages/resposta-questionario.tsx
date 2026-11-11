import { MessageSquare } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/affect/button'
import { PageHeader, Person, Pill } from '@/components/page'
import { routineForm } from '@/lib/forms'
import { students } from '@/lib/data'
import { NaoEncontrada } from '@/pages/nao-encontrada'

export function RespostaQuestionario() {
  const { id } = useParams()
  const navigate = useNavigate()
  const s = students.find((x) => x.id === id)
  if (!s) return <NaoEncontrada />
  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/acompanhamento?aba=questionarios" className="mb-4 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
        Voltar para questionários
      </Link>
      <PageHeader
        title={routineForm.title}
        description={<Person name={s.name} sub="Respondido há 20 min" size="sm" />}
        actions={
          <Button variant="secondary" icon={<MessageSquare />} onClick={() => navigate('/mensagens')}>
            Conversar com {s.name.split(' ')[0]}
          </Button>
        }
      />
      <ol className="grid gap-3">
        {routineForm.questions.map((x, i) => (
          <li key={x.q} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">Pergunta {i + 1}</p>
            <p className="mt-0.5 text-sm font-medium">{x.q}</p>
            <p className="mt-2 text-sm">{x.a}</p>
            {x.q.includes('dor') && <Pill tone="warning" className="mt-3">Merece atenção</Pill>}
          </li>
        ))}
      </ol>
    </div>
  )
}
