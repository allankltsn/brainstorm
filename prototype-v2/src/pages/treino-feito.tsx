import { ArrowLeft, Clock, Flame, Send, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { TextArea } from '@/components/affect/text-area'
import { PageHeader, Person, Pill, Section } from '@/components/page'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { doneSessions } from '@/lib/tracking'
import { NaoEncontrada } from '@/pages/nao-encontrada'

export function TreinoFeito() {
  const { id } = useParams()
  const x = doneSessions.find((d) => d.id === id)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  if (!x) return <NaoEncontrada />
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/acompanhamento?aba=feitos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Treinos feitos
      </Link>
      <PageHeader title={x.workout} description={<Person name={x.name} sub={x.when} size="sm" />} />
      <div className="mb-6 flex flex-wrap gap-2">
        <Pill icon={<Clock />}>{x.duration}</Pill>
        <Pill tone={x.effort === 'Intenso' ? 'warning' : 'neutral'} icon={<Flame />}>
          Esforço {x.effort.toLowerCase()}
        </Pill>
        {x.pain && (
          <Pill tone="danger" icon={<TriangleAlert />}>
            Relatou dor
          </Pill>
        )}
      </div>
      {x.pain && (
        <div role="alert" className="mb-6 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p>{x.pain}</p>
        </div>
      )}
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Exercício</TableHead>
              <TableHead className="hidden sm:table-cell">Planejado</TableHead>
              <TableHead>Feito</TableHead>
              <TableHead className="pr-5">Carga</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {x.items.map((it) => (
              <TableRow key={it.exercise}>
                <TableCell className="py-3 pl-5 text-sm font-medium whitespace-normal">{it.exercise}</TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">{it.planned}</TableCell>
                <TableCell className="text-sm">
                  {it.done}
                  {parseInt(it.done) < parseInt(it.planned) && <Pill tone="warning" className="ml-2">Incompleto</Pill>}
                </TableCell>
                <TableCell className="pr-5 text-sm tabular-nums">{it.load}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {x.note && (
        <Section title="Comentário do aluno" className="mt-6">
          <p className="text-sm">{x.note}</p>
        </Section>
      )}
      <Section title="Seu retorno" description="O aluno recebe como mensagem." className="mt-6">
        <TextArea aria-label="Retorno para o aluno" placeholder="Ex.: ótimo treino! Na próxima, mantenha a carga do desenvolvimento." minRows={3} value={reply} onChange={(e) => setReply(e.target.value)} />
        <div className="mt-4 flex justify-end">
          <Button
            icon={<Send />}
            loading={sending}
            disabled={!reply.trim()}
            onClick={() => {
              setSending(true)
              setTimeout(() => {
                setSending(false)
                setReply('')
                toast.success('Retorno enviado')
              }, 800)
            }}
          >
            {sending ? 'Enviando' : 'Enviar retorno'}
          </Button>
        </div>
      </Section>
    </div>
  )
}
