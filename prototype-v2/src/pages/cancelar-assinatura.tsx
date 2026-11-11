import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { Select } from '@/components/affect/select'
import { TextArea } from '@/components/affect/text-area'
import { PageHeader, Section } from '@/components/page'

const REASONS = ['Preço alto', 'Não uso o suficiente', 'Faltam recursos', 'Mudei de ferramenta', 'Outro motivo']

export function CancelarAssinatura() {
  const navigate = useNavigate()
  const [reason, setReason] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Cancelar assinatura" description="Você mantém o plano Pro até 03/11/2026, fim do período já pago." />
      <div role="alert" className="mb-6 flex gap-3 rounded-xl border border-warning/40 bg-warning-soft p-4 text-sm text-warning">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" />
        <p>
          Depois dessa data o plano volta para o Starter, com até 5 alunos. Os outros 13 alunos ativos ficam pausados, sem perder histórico.
        </p>
      </div>
      <Section title="Pode nos contar o motivo?" description="Opcional. Ajuda a melhorar o aura-fit.">
        <div className="grid gap-4">
          <Select aria-label="Motivo do cancelamento" placeholder="Escolha um motivo" value={reason} onChange={setReason} options={REASONS.map((r) => ({ value: r, label: r }))} />
          <TextArea label="Quer comentar?" optional />
        </div>
      </Section>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Button variant="secondary" onClick={() => navigate('/configuracoes?aba=assinatura')}>
          Manter meu plano
        </Button>
        <Button
          variant="destructive"
          loading={loading}
          onClick={() => {
            setLoading(true)
            setTimeout(() => {
              toast.success('Cancelamento agendado', { description: 'O plano Pro segue ativo até 03/11/2026.' })
              navigate('/configuracoes?aba=assinatura')
            }, 900)
          }}
        >
          {loading ? 'Cancelando' : 'Cancelar assinatura'}
        </Button>
      </div>
    </div>
  )
}
