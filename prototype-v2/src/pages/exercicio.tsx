import { ArrowLeft, Check, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { TagInput } from '@/components/affect/tag-input'
import { TextField } from '@/components/affect/text-field'
import { ExerciseThumb } from '@/components/exercise-thumb'
import { Pill, Section } from '@/components/page'
import { findExercise, GROUPS, type Exercise } from '@/lib/training'

const Back = () => (
  <Link to="/treinos?aba=exercicios" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
    <ArrowLeft className="size-4" /> Exercícios
  </Link>
)

export function ExercicioDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const e = findExercise(id)
  const [fav, setFav] = useState(false)
  if (!e) {
    return (
      <div className="py-16 text-center">
        <p className="font-medium">Exercício não encontrado</p>
        <Link to="/treinos?aba=exercicios" className="mt-2 inline-block text-sm text-brand-text hover:underline">
          Voltar para os exercícios
        </Link>
      </div>
    )
  }
  return (
    <>
      <Back />
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{e.name}</h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Pill>{e.group}</Pill>
            <Pill>{e.kind}</Pill>
            <Pill>{e.equipment}</Pill>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" icon={<Star className={fav ? 'fill-current' : ''} />} aria-pressed={fav} onClick={() => setFav((f) => !f)}>
            {fav ? 'Favorito' : 'Favoritar'}
          </Button>
          <Button variant="secondary" icon={<Pencil />} onClick={() => navigate(`/treinos/exercicios/${e.id}/editar`)}>
            Editar
          </Button>
          <Button icon={<Plus />} onClick={() => toast.success(`${e.name} adicionado ao rascunho de treino`)}>
            Adicionar a um treino
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-6">
          <ExerciseThumb exercise={e} size="hero" />
          <Section title="Como executar">
            <ol className="grid gap-3">
              {e.steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm leading-relaxed">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium tabular-nums">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </Section>
        </div>
        <div className="grid content-start gap-6">
          <Section title="Músculos trabalhados">
            <div className="flex flex-wrap gap-1.5">
              {e.muscles.map((m, i) => (
                <Pill key={m} tone={i === 0 ? 'brand' : 'neutral'}>
                  {m}
                  {i === 0 && <span className="sr-only"> (principal)</span>}
                </Pill>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">O primeiro é o músculo principal.</p>
          </Section>
          <Section title="Dicas">
            <ul className="grid gap-2.5">
              {e.tips.map((t) => (
                <li key={t} className="flex gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {t}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </>
  )
}

/* Lista de linhas editáveis (passos, dicas): um campo por linha, com adicionar e remover. */
function Lines({ label, placeholder, value, onChange, addLabel }: { label: string; placeholder: string; value: string[]; onChange: (v: string[]) => void; addLabel: string }) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-1.5 text-sm font-medium">{label}</legend>
      {value.map((line, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-5 text-center text-sm text-muted-foreground tabular-nums">{i + 1}</span>
          <TextField aria-label={`${label} ${i + 1}`} placeholder={placeholder} value={line} onChange={(e) => onChange(value.map((l, j) => (j === i ? e.target.value : l)))} className="flex-1" />
          <button
            type="button"
            aria-label={`Remover linha ${i + 1}`}
            disabled={value.length === 1}
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <div className="pl-7">
        <Button size="sm" variant="ghost" icon={<Plus />} onClick={() => onChange([...value, ''])}>
          {addLabel}
        </Button>
      </div>
    </fieldset>
  )
}

export function ExercicioForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const base = findExercise(id)
  const [name, setName] = useState(base?.name ?? '')
  const [group, setGroup] = useState<string | null>(base?.group ?? null)
  const [kind, setKind] = useState<Exercise['kind']>(base?.kind ?? 'Força')
  const [steps, setSteps] = useState(base?.steps ?? [''])
  const [tips, setTips] = useState(base?.tips ?? [''])
  const [errors, setErrors] = useState<{ name?: string; group?: string }>({})
  const [saving, setSaving] = useState(false)

  function save(ev: React.FormEvent) {
    ev.preventDefault()
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'Dê um nome ao exercício.'
    if (!group) next.group = 'Escolha o grupo muscular.'
    setErrors(next)
    if (Object.keys(next).length) return
    setSaving(true)
    setTimeout(() => {
      toast.success(base ? 'Exercício atualizado' : 'Exercício criado')
      navigate('/treinos?aba=exercicios')
    }, 800)
  }

  return (
    <form onSubmit={save} noValidate className="mx-auto max-w-2xl">
      <Back />
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">{base ? 'Editar exercício' : 'Criar exercício'}</h1>
      <div className="grid gap-6">
        <Section title="O básico">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Nome do exercício"
              placeholder="Ex.: Supino reto"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setErrors((x) => ({ ...x, name: undefined }))
              }}
              error={errors.name}
              className="sm:col-span-2"
            />
            <Select
              label="Grupo muscular"
              placeholder="Escolha"
              value={group}
              onChange={(v) => {
                setGroup(v)
                setErrors((x) => ({ ...x, group: undefined }))
              }}
              error={errors.group}
              options={GROUPS.map((g) => ({ value: g, label: g }))}
            />
            <TextField label="Equipamento" optional placeholder="Ex.: Halteres e banco" defaultValue={base?.equipment} />
            <div className="grid gap-1.5 sm:col-span-2">
              <span id="lbl-tipo" className="text-sm font-medium">
                Tipo
              </span>
              <SegmentedControl<Exercise['kind']> aria-labelledby="lbl-tipo" value={kind} onChange={setKind} options={(['Força', 'Mobilidade', 'Cardio'] as const).map((k) => ({ value: k, label: k }))} />
            </div>
            <TagInput label="Músculos trabalhados" optional placeholder="Ex.: Peitoral" hint="Aperte Enter depois de cada um. O primeiro é o principal." defaultValue={base?.muscles} className="sm:col-span-2" />
          </div>
        </Section>

        <Section title="Vídeo" description="Ajuda o aluno a fazer o movimento certo.">
          <TextField label="Link do vídeo" optional type="url" placeholder="https://" hint="Cole um link ou envie um arquivo de até 50 MB." />
          <div className="mt-3">
            <Button size="sm" variant="secondary" onClick={() => toast('Escolha um arquivo de vídeo')}>
              Enviar arquivo
            </Button>
          </div>
        </Section>

        <Section title="Instruções para o aluno">
          <div className="grid gap-6">
            <Lines label="Como executar" placeholder="Descreva um passo" value={steps} onChange={setSteps} addLabel="Adicionar passo" />
            <Lines label="Dicas" placeholder="Um cuidado ou lembrete" value={tips} onChange={setTips} addLabel="Adicionar dica" />
          </div>
        </Section>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => navigate('/treinos?aba=exercicios')}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {saving ? 'Salvando' : base ? 'Salvar alterações' : 'Criar exercício'}
          </Button>
        </div>
      </div>
    </form>
  )
}
