import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { Select } from '@/components/affect/select'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Section } from '@/components/page'

type Question = { key: number; text: string; kind: string }
const KINDS = [
  { value: 'texto', label: 'Texto livre' },
  { value: 'nota', label: 'Nota de 0 a 10' },
  { value: 'simnao', label: 'Sim ou não' },
]

export function ModeloQuestionario() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState<string>()
  const [qs, setQs] = useState<Question[]>([{ key: 1, text: 'Como você se sentiu nos treinos desta semana?', kind: 'texto' }])
  const patch = (key: number, p: Partial<Question>) => setQs((l) => l.map((q) => (q.key === key ? { ...q, ...p } : q)))

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/acompanhamento/questionarios/enviar" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Enviar questionário
      </Link>
      <PageHeader title="Novo modelo de questionário" description="Monte as perguntas uma vez e reutilize com vários alunos." />
      <Section title="Nome do modelo">
        <TextField aria-label="Nome do modelo" placeholder="Ex.: Check-in quinzenal" value={name} onChange={(e) => setName(e.target.value)} error={nameError} />
      </Section>
      <Section title="Perguntas" description="Evite pedir dados de saúde se o aluno ainda não liberou." className="mt-6">
        <ol className="grid gap-4">
          {qs.map((q, i) => (
            <li key={q.key} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[minmax(0,1fr)_11rem_auto] sm:items-end">
              <TextField label={`Pergunta ${i + 1}`} value={q.text} onChange={(e) => patch(q.key, { text: e.target.value })} />
              <Select label="Resposta" value={q.kind} onChange={(v) => patch(q.key, { kind: v })} options={KINDS} />
              <Button variant="ghost" icon={<Trash2 />} aria-label={`Remover pergunta ${i + 1}`} disabled={qs.length === 1} onClick={() => setQs((l) => l.filter((x) => x.key !== q.key))} />
            </li>
          ))}
        </ol>
        <Button variant="secondary" icon={<Plus />} className="mt-4" onClick={() => setQs((l) => [...l, { key: Math.max(...l.map((x) => x.key)) + 1, text: '', kind: 'texto' }])}>
          Adicionar pergunta
        </Button>
      </Section>
      <div className="mt-6 flex justify-end">
        <Button
          onClick={() => {
            if (!name.trim()) return setNameError('Dê um nome ao modelo.')
            if (qs.some((q) => !q.text.trim())) return toast.error('Preencha todas as perguntas')
            toast.success('Modelo salvo')
            navigate('/acompanhamento/questionarios/enviar')
          }}
        >
          Salvar modelo
        </Button>
      </div>
    </div>
  )
}
