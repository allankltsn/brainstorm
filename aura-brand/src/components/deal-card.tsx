import { FileText, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { Select } from '@/components/affect/select'
import { TextField } from '@/components/affect/text-field'
import { Pill } from '@/components/page'
import { brl, dateLabel, stageLabel, STAGES, useCrm, type Deal, type Proposal, type Stage } from '@/lib/crm'

/* Negócio com etapa, valor e propostas. Usado no painel do Atendimento e na ficha do contato. */
const PROPOSAL_LABEL: Record<Proposal['status'], string> = { rascunho: 'Rascunho', enviada: 'Enviada', aceita: 'Aceita', recusada: 'Recusada' }
const PROPOSAL_TONE = { rascunho: 'neutral', enviada: 'warning', aceita: 'success', recusada: 'danger' } as const
const ranNote = (ran: string[]) => (ran.length ? `Automação enviada: ${ran.join(', ')}.` : undefined)

export function DealCard({ deal }: { deal: Deal }) {
  const { proposals, moveDeal, addProposal, setProposal, restore, snapshot } = useCrm()
  const mine = proposals.filter((p) => p.dealId === deal.id)
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState(deal.title)
  const [amount, setAmount] = useState(deal.value ? String(deal.value) : '')
  const valid = title.trim().length > 2 && Number(amount) > 0
  return (
    <div className="rounded-lg border p-3">
      <p className="text-sm font-medium">{deal.title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">{deal.value > 0 ? brl(deal.value) : 'Sem valor ainda'}</p>
      <div className="mt-2.5">
        <Select
          size="sm"
          aria-label={`Etapa do negócio ${deal.title}`}
          value={deal.stage}
          options={STAGES.map((s) => ({ value: s.id, label: s.label }))}
          onChange={(v) => {
            const before = snapshot()
            const ran = moveDeal(deal.id, v as Stage)
            toast.success(`Negócio foi para ${stageLabel(v as Stage)}`, { description: ranNote(ran), action: { label: 'Desfazer', onClick: () => restore(before) } })
          }}
        />
      </div>
      {mine.length > 0 && (
        <ul className="mt-3 grid gap-2">
          {mine.map((p) => (
            <li key={p.id} className="rounded-md bg-muted/50 p-2.5">
              <p className="flex flex-wrap items-center justify-between gap-1.5 text-xs font-medium">
                <span className="flex min-w-0 items-center gap-1.5">
                  <FileText className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{p.title}</span>
                </span>
                <Pill tone={PROPOSAL_TONE[p.status]}>{PROPOSAL_LABEL[p.status]}</Pill>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                {brl(p.value)}, {dateLabel(p.date)}
              </p>
              {p.status === 'rascunho' && (
                <Button size="sm" className="mt-2" onClick={() => toast.success('Proposta enviada', { description: ranNote(setProposal(p.id, 'enviada')) ?? 'O negócio foi para Proposta.' })}>
                  Enviar proposta
                </Button>
              )}
              {p.status === 'enviada' && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Button size="sm" variant="secondary" onClick={() => toast.success('Proposta aceita', { description: ranNote(setProposal(p.id, 'aceita')) ?? 'O negócio foi para Fechado.' })}>
                    Aceita
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => (setProposal(p.id, 'recusada'), toast('Proposta marcada como recusada'))}>
                    Recusada
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {adding ? (
        <form
          className="mt-3 grid gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!valid) return
            addProposal(deal.id, title.trim(), Number(amount))
            setAdding(false)
            toast.success('Proposta criada como rascunho', { description: 'Sai no modelo de PDF da marca. Revise e envie.' })
          }}
        >
          <TextField size="sm" label="Proposta" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
          <TextField size="sm" label="Valor" type="number" min={1} prefix="R$" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <div className="flex gap-1.5">
            <Button type="submit" size="sm" disabled={!valid}>
              Criar proposta
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        deal.stage !== 'ganho' &&
        deal.stage !== 'perdido' && (
          <Button size="sm" variant="ghost" icon={<Plus />} className="mt-2" onClick={() => setAdding(true)}>
            Criar proposta
          </Button>
        )
      )}
    </div>
  )
}

