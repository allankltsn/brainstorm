import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { DecisionInbox } from '@/components/affect/decision-inbox'
import { MessageActions, MessageText } from '@/components/affect/message-actions'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { TagInput } from '@/components/affect/tag-input'
import { TextArea } from '@/components/affect/text-area'
import { ThinkingLoader } from '@/components/affect/thinking-loader'
import { PageHeader, Pill, Section } from '@/components/page'
import { students } from '@/lib/data'

type Goal = 'hipertrofia' | 'emagrecimento' | 'condicionamento'

const VERSIONS = [
  'Treino A (segunda e quinta): supino reto 3x10, remada curvada 3x10, desenvolvimento 3x12, rosca direta 2x12, prancha 3x30s.\n\nTreino B (terça e sexta): agachamento 3x10, levantamento terra romeno 3x10, afundo 3x12, panturrilha 3x15, abdominal 3x15.\n\nProgressão: aumente a carga quando completar todas as repetições por duas sessões seguidas.',
  'Treino único, 3 vezes por semana: agachamento 3x10, supino reto 3x10, remada curvada 3x10, desenvolvimento 2x12, prancha 3x30s.\n\nSessões de cerca de 40 minutos, com um dia de descanso entre elas.',
]

export function IA() {
  const eligible = students.filter((s) => s.status === 'ativo' && s.health === 'liberado')
  const [student, setStudent] = useState<string | null>(null)
  const [goal, setGoal] = useState<Goal>('hipertrofia')
  const [phase, setPhase] = useState<'form' | 'thinking' | 'done'>('form')
  const [count, setCount] = useState(1)
  const [version, setVersion] = useState(0)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState<string>()

  function generate() {
    if (!student) return setError('Escolha um aluno para continuar.')
    setError(undefined)
    setPhase('thinking')
    setTimeout(() => setPhase('done'), 4200)
  }

  return (
    <>
      <PageHeader
        title="Sugerir treino com IA"
        description="A IA monta um rascunho. Você revisa e decide o que vai para o aluno."
        actions={
          <Link to="/ia/dados" className="text-sm font-medium text-brand-text underline-offset-4 hover:underline">
            Quais dados a IA usa
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <Section title="1. Conte o que você precisa" className="self-start">
          <div className="grid gap-5">
            <Select
              label="Aluno"
              placeholder="Escolha um aluno"
              value={student}
              onChange={(v) => {
                setStudent(v)
                setError(undefined)
              }}
              error={error}
              hint="Só aparecem alunos que liberaram os dados de saúde."
              options={eligible.slice(0, 8).map((s) => ({ value: s.id, label: s.name, description: s.plan ?? 'Sem treino' }))}
            />
            <div className="grid gap-1.5">
              <span className="text-sm font-medium" id="lbl-objetivo">
                Objetivo
              </span>
              <SegmentedControl<Goal>
                aria-labelledby="lbl-objetivo"
                fullWidth
                size="sm"
                value={goal}
                onChange={setGoal}
                options={[
                  { value: 'hipertrofia', label: 'Ganhar massa' },
                  { value: 'emagrecimento', label: 'Emagrecer' },
                  { value: 'condicionamento', label: 'Fôlego' },
                ]}
              />
            </div>
            <TagInput label="Restrições" optional placeholder="Ex.: joelho, ombro" hint="Aperte Enter depois de cada uma." defaultValue={['joelho direito']} />
            <TextArea label="Observações" optional placeholder="Ex.: treina em casa, tem halteres e elástico" minRows={2} maxRows={6} />
            <Button icon={<Sparkles />} loading={phase === 'thinking'} onClick={generate} className="w-full">
              {phase === 'thinking' ? 'Montando' : phase === 'done' ? 'Gerar de novo' : 'Gerar sugestão'}
            </Button>
          </div>
        </Section>

        <div className="grid content-start gap-6">
          <Section title="2. Revise a sugestão" action={phase === 'done' ? <Pill tone="info">Rascunho</Pill> : undefined}>
            {phase === 'form' && (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-14 text-center">
                <Sparkles className="size-7 text-muted-foreground" />
                <p className="font-medium">A sugestão aparece aqui</p>
                <p className="max-w-sm text-sm text-muted-foreground">Preencha os campos ao lado e toque em Gerar sugestão. Nada é enviado ao aluno sem a sua aprovação.</p>
              </div>
            )}
            {phase === 'thinking' && (
              <div className="py-10">
                <ThinkingLoader phases={['Lendo o histórico do aluno', 'Conferindo as restrições', 'Escolhendo os exercícios', 'Montando a semana']} interval={1000} />
              </div>
            )}
            {phase === 'done' && (
              <div data-ui-message>
                <ThinkingLoader done doneLabel="Sugestão pronta" variant="plain" size="sm" className="mb-3" />
                <MessageText version={version} className="text-sm leading-relaxed whitespace-pre-line">
                  {VERSIONS[version % VERSIONS.length]}
                </MessageText>
                <MessageActions
                  className="mt-3"
                  quiet={false}
                  label="Ações da sugestão"
                  text={VERSIONS[version % VERSIONS.length]}
                  actions={['copy', 'regenerate', 'feedback']}
                  versions={count}
                  version={version}
                  onVersionChange={setVersion}
                  regenerating={regenerating}
                  onRegenerate={() => {
                    setRegenerating(true)
                    setTimeout(() => {
                      setRegenerating(false)
                      setCount((c) => c + 1)
                      setVersion(count)
                    }, 1400)
                  }}
                  reasons={['Exercícios inadequados', 'Volume alto demais', 'Ignora uma restrição', 'Outro']}
                  onCopy={() => toast('Sugestão copiada')}
                />
                <div className="mt-5 flex flex-wrap justify-end gap-2 border-t pt-4">
                  <Button variant="ghost" onClick={() => setPhase('form')}>
                    Descartar
                  </Button>
                  <Button variant="secondary">Editar antes de enviar</Button>
                  <Button onClick={() => toast.success('Treino enviado ao aluno')}>Aprovar e enviar</Button>
                </div>
              </div>
            )}
          </Section>

          <div>
            <h2 className="mb-3 text-sm font-semibold">Esperando sua decisão</h2>
            <DecisionInbox
              decisions={[
                { id: 'd1', title: 'Felipe Almeida: trocar corrida por bicicleta', detail: 'Ele relatou dor no tornozelo no último questionário.', primary: 'Aprovar troca', secondary: 'Manter treino' },
                { id: 'd2', title: 'Carlos Nunes: aumentar a carga em 5%', detail: 'Completou todas as repetições nas últimas 3 sessões.', primary: 'Aumentar', secondary: 'Agora não' },
              ]}
              onDecide={(d, a) => toast(`${d.title.split(':')[0]}: ${a === 'primary' ? d.primary : d.secondary}`)}
            />
          </div>
        </div>
      </div>
    </>
  )
}
