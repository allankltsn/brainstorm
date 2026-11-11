import { ArrowLeft, Plus, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Person, Pill, Section } from '@/components/page'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { students } from '@/lib/data'
import { guardians as seed } from '@/lib/extras'
import { NaoEncontrada } from '@/pages/nao-encontrada'

type Mode = 'Remoto' | 'Presencial'

export function AlunoResponsaveis() {
  const { id } = useParams()
  const s = students.find((x) => x.id === id)
  const [mode, setMode] = useState<Mode>(s?.mode ?? 'Remoto')
  const [list, setList] = useState(seed)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [error, setError] = useState<string>()
  if (!s) return <NaoEncontrada />
  const first = s.name.split(' ')[0]

  function add() {
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) return setError('Informe o nome e um e-mail válido.')
    setList((l) => [...l, { id: `g${l.length + 1}`, name: form.name, relation: 'Responsável', email: form.email, main: l.length === 0 }])
    setForm({ name: '', email: '' })
    setError(undefined)
    setAdding(false)
    toast.success('Responsável adicionado', { description: `${first} será avisado da mudança.` })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to={`/alunos/${s.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {s.name}
      </Link>
      <PageHeader title="Acompanhamento e responsáveis" description={`Como você acompanha ${first} e quem responde por ele.`} />
      <Section title="Modo de acompanhamento" description="No presencial, você registra o treino junto com o aluno.">
        <SegmentedControl<Mode>
          aria-label="Modo de acompanhamento"
          value={mode}
          onChange={(m) => {
            setMode(m)
            toast.success(`Modo alterado para ${m.toLowerCase()}`, { description: `${first} precisa confirmar a mudança.` })
          }}
          options={[
            { value: 'Remoto', label: 'Remoto' },
            { value: 'Presencial', label: 'Presencial' },
          ]}
        />
      </Section>
      <Section
        title="Responsáveis"
        description="Para alunos menores de 18 anos. O principal recebe os avisos e dá as autorizações."
        className="mt-6"
        action={
          <Button size="sm" variant="secondary" icon={<Plus />} onClick={() => setAdding(true)}>
            Adicionar
          </Button>
        }
      >
        {list.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">Nenhum responsável. Se o aluno for menor de idade, adicione um para liberar os treinos.</p>
        ) : (
          <ul className="divide-y">
            {list.map((g) => (
              <li key={g.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                <span className="min-w-0 flex-1">
                  <Person name={g.name} sub={`${g.relation} · ${g.email}`} size="sm" />
                </span>
                {g.main ? (
                  <Pill tone="brand" icon={<Star />}>
                    Principal
                  </Pill>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setList((l) => l.map((x) => ({ ...x, main: x.id === g.id })))}>
                    Tornar principal
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<Trash2 />}
                  aria-label={`Remover ${g.name}`}
                  disabled={g.main && list.length > 1}
                  onClick={() => {
                    setList((l) => l.filter((x) => x.id !== g.id))
                    toast.success(`${g.name} removido`)
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </Section>
      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar responsável</DialogTitle>
            <DialogDescription>A pessoa recebe um e-mail para confirmar que responde por {first}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <TextField label="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={error} />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setAdding(false)}>
              Cancelar
            </Button>
            <Button onClick={add}>Adicionar responsável</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
