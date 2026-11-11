import { Check, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Pill } from '@/components/page'
import { Button } from '@/components/ui/button'
import { useContent } from '@/lib/content'
import { KIND_LABEL } from '@/lib/data'

/* Regra do produto: a IA só sugere. Nada é publicado sem aprovação. Usada no Início e em Conteúdo. */
export function ApprovalList() {
  const { items, approve, requestChange } = useContent()
  const pending = items.filter((i) => i.status === 'aprovacao')

  if (pending.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <CheckCircle2 className="size-8 text-success" aria-hidden="true" />
        <p className="text-sm font-medium">Tudo em dia</p>
        <p className="text-sm text-muted-foreground">Novas sugestões aparecem aqui quando ficarem prontas.</p>
      </div>
    )
  }
  return (
    <ul className="grid gap-3">
      {pending.map((a) => (
        <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
          <div className="min-w-0 flex-1 basis-64">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">{a.title}</p>
              <Pill>{KIND_LABEL[a.kind]}</Pill>
              <Pill>{a.channel}</Pill>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{a.caption}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="min-h-11"
              onClick={() => {
                requestChange(a.id)
                toast.info('Devolvido para ajuste', { description: 'Fica na aba Em ajuste até uma nova versão.' })
              }}
            >
              Pedir ajuste
            </Button>
            <Button
              variant="secondary"
              className="min-h-11"
              onClick={() => {
                approve(a.id)
                toast.success('Aprovado', { description: 'Defina o horário na aba Agendados.' })
              }}
            >
              <Check /> Aprovar
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
