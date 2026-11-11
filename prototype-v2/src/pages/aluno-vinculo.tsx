import { ArrowLeft, Pause, Play, UserMinus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { TextArea } from '@/components/affect/text-area'
import { PageHeader, Section } from '@/components/page'
import { students } from '@/lib/data'
import { NaoEncontrada } from '@/pages/nao-encontrada'

type Action = 'pausar' | 'encerrar'

export function AlunoVinculo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const s = students.find((x) => x.id === id)
  const [action, setAction] = useState<Action>('pausar')
  const [loading, setLoading] = useState(false)
  if (!s) return <NaoEncontrada />
  const first = s.name.split(' ')[0]
  const paused = s.status === 'pausado'
  const finish = (msg: string) => {
    setLoading(true)
    setTimeout(() => {
      toast.success(msg)
      navigate(`/alunos/${s.id}`)
    }, 800)
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link to={`/alunos/${s.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {s.name}
      </Link>
      <PageHeader title="Pausar ou encerrar" description={`O que acontece com o acompanhamento de ${first}.`} />
      {paused ? (
        <Section title="Acompanhamento pausado" description={`${first} não recebe treinos novos e não ocupa alertas.`}>
          <Button icon={<Play />} loading={loading} onClick={() => finish(`Acompanhamento de ${first} retomado`)}>
            Retomar acompanhamento
          </Button>
        </Section>
      ) : (
        <>
          <SegmentedControl<Action>
            aria-label="O que você quer fazer"
            fullWidth
            value={action}
            onChange={setAction}
            className="mb-6"
            options={[
              { value: 'pausar', label: 'Pausar', icon: <Pause className="size-4" /> },
              { value: 'encerrar', label: 'Encerrar', icon: <UserMinus className="size-4" /> },
            ]}
          />
          <Section
            title={action === 'pausar' ? 'Pausar por um tempo' : 'Encerrar o acompanhamento'}
            description={
              action === 'pausar'
                ? `${first} continua vendo o treino atual, mas a vaga segue ocupada. Você pode retomar quando quiser.`
                : `${first} perde o acesso aos treinos e a vaga é liberada. O histórico fica guardado no seu Histórico.`
            }
          >
            <TextArea label="Motivo" optional hint="Só você vê. Evite dados de saúde." maxLength={300} counter />
          </Section>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={() => navigate(`/alunos/${s.id}`)}>
              Voltar
            </Button>
            {action === 'pausar' ? (
              <Button loading={loading} onClick={() => finish(`Acompanhamento de ${first} pausado`)}>
                Pausar acompanhamento
              </Button>
            ) : (
              <Button variant="destructive" loading={loading} onClick={() => finish(`Acompanhamento de ${first} encerrado`)}>
                Encerrar acompanhamento
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
