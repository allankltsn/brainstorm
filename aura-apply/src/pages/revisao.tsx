import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, ChevronDown, Monitor, SendHorizonal, Upload, X } from 'lucide-react'
import { Button } from '@/components/affect/button'
import { TextField } from '@/components/affect/text-field'
import { TextArea } from '@/components/affect/text-area'
import { Select } from '@/components/affect/select'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Switch } from '@/components/affect/switch'
import { StatusMark } from '@/components/bits'
import { buildForm, getJob, type FormField } from '@/lib/data'

function fechar(navigate: (to: string) => void) {
  // a aba foi aberta por window.open, então fechar funciona; se não, volta pra lista
  window.close()
  setTimeout(() => navigate('/vagas'), 120)
}

/** Recalcula o status ao editar: o read-back vira ✅ quando o valor fica válido. */
function reavaliar(field: FormField, value: string): FormField['status'] {
  if (field.id === 'cidade') return value === 'brasilia-df' ? 'ok' : 'warn'
  if (field.id === 'curriculo') return value ? 'ok' : 'error'
  if (field.required && !value) return 'error'
  return 'ok'
}

function Controle({ field, onChange }: { field: FormField; onChange: (v: string) => void }) {
  switch (field.type) {
    case 'select':
      return (
        <Select
          options={field.options ?? []}
          value={field.value}
          onChange={(v) => onChange(v)}
          error={field.status === 'warn' ? field.note : undefined}
        />
      )
    case 'radio':
      return (
        <SegmentedControl
          value={field.value}
          onChange={onChange}
          options={(field.options ?? []).map((o) => ({ value: o.value, label: o.label }))}
        />
      )
    case 'checkbox':
      return (
        <Switch
          placement="end"
          checked={field.value === 'sim'}
          onChange={(e) => onChange((e.target as HTMLInputElement).checked ? 'sim' : 'nao')}
          label={field.label}
        />
      )
    case 'textarea':
      return <TextArea value={field.value} onChange={(e) => onChange(e.target.value)} minRows={3} maxRows={8} />
    default:
      return <TextField type={field.type} value={field.value} onChange={(e) => onChange(e.target.value)} />
  }
}

/** Card de handoff: o caso do upload por arrastar-e-soltar que não dá para automatizar. */
function HandoffCurriculo({ field, onChange }: { field: FormField; onChange: (v: string) => void }) {
  const [assumir, setAssumir] = useState(false)
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
      <p className="text-sm text-foreground">{field.note}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" icon={<Upload size={15} />} onClick={() => onChange('curriculo-alex.pdf')}>
          Enviar currículo
        </Button>
        <Button size="sm" variant="secondary" icon={<Monitor size={15} />} onClick={() => setAssumir((v) => !v)}>
          Assumir no navegador
        </Button>
      </div>
      {assumir && (
        <div className="mt-3 overflow-hidden rounded-md border bg-card">
          <div className="flex items-center gap-1.5 border-b bg-muted px-2.5 py-1.5">
            <span className="size-2 rounded-full bg-destructive/40" />
            <span className="size-2 rounded-full bg-warning/50" />
            <span className="size-2 rounded-full bg-success/50" />
            <span className="ml-2 truncate text-xs text-muted-foreground">navegador remoto · campo do currículo</span>
          </div>
          <div className="grid h-36 place-items-center p-4 text-center">
            <div className="rounded-lg border-2 border-dashed border-primary/40 px-6 py-5">
              <Upload size={20} className="mx-auto text-primary" />
              <p className="mt-2 text-xs text-muted-foreground">Arraste o PDF aqui</p>
            </div>
          </div>
          <p className="border-t px-3 py-2 text-xs text-muted-foreground">
            Visão recortada só do campo travado, já no formato do seu celular. No sistema real é o navegador da VPS ao vivo.
          </p>
        </div>
      )}
    </div>
  )
}

export function Revisao() {
  const { id } = useParams()
  const navigate = useNavigate()
  const job = id ? getJob(id) : undefined
  const [fields, setFields] = useState<FormField[]>(() => (job ? buildForm(job) : []))
  const [enviada, setEnviada] = useState(false)

  const update = (fid: string, value: string) =>
    setFields((prev) => prev.map((f) => (f.id === fid ? { ...f, value, status: reavaliar(f, value) } : f)))

  const pendentes = useMemo(() => fields.filter((f) => f.status !== 'ok'), [fields])
  const conferidos = useMemo(() => fields.filter((f) => f.status === 'ok'), [fields])
  const temErro = pendentes.some((f) => f.status === 'error')
  const [verConferidos, setVerConferidos] = useState(false)

  if (!job) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <p className="text-muted-foreground">Vaga não encontrada.</p>
          <Button className="mt-4" variant="secondary" onClick={() => navigate('/vagas')}>
            Voltar às vagas
          </Button>
        </div>
      </div>
    )
  }

  if (enviada) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background p-6 text-center">
        <div className="max-w-sm">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-success">
            <Check size={28} strokeWidth={2.5} />
          </div>
          <h1 className="mt-4 text-xl font-semibold">Candidatura enviada</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {job.title} · {job.company}. Você acompanha o status em Candidaturas.
          </p>
          <Button className="mt-5" onClick={() => fechar(navigate)}>
            Fechar aba
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* Barra do topo */}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-card/90 px-4 py-3 backdrop-blur">
        <button
          type="button"
          aria-label="Fechar"
          onClick={() => fechar(navigate)}
          className="grid size-9 place-items-center rounded-lg border bg-background text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">{job.title}</h1>
          <p className="truncate text-xs text-muted-foreground">
            {job.company} · formulário via {job.ats}
          </p>
        </div>
        <span className="ml-auto whitespace-nowrap text-xs text-muted-foreground">
          {conferidos.length} de {fields.length} ok
        </span>
      </header>

      <div className="mx-auto w-full max-w-xl flex-1 space-y-6 px-4 py-6">
        {/* Preenchido automaticamente — resumo */}
        <p className="text-sm text-muted-foreground">
          Preenchemos o formulário com o seu perfil.{' '}
          {pendentes.length > 0 ? (
            <span className="text-foreground">
              {pendentes.length === 1
                ? 'Confirme o item abaixo antes de enviar.'
                : `Confirme os ${pendentes.length} itens abaixo antes de enviar.`}
            </span>
          ) : (
            <span className="text-success">Tudo conferido. Pode enviar.</span>
          )}
        </p>

        {/* Precisam de você */}
        {pendentes.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Precisam de você ({pendentes.length})</h2>
            {pendentes.map((f) => (
              <div key={f.id} className="rounded-xl border bg-card p-4">
                <div className="mb-2 flex items-center gap-2">
                  <StatusMark status={f.status} />
                  <span className="text-sm font-medium">{f.label}</span>
                </div>
                {f.id === 'curriculo' ? (
                  <HandoffCurriculo field={f} onChange={(v) => update(f.id, v)} />
                ) : (
                  <Controle field={f} onChange={(v) => update(f.id, v)} />
                )}
              </div>
            ))}
          </section>
        )}

        {/* Conferidos (recolhido) */}
        <section className="rounded-xl border bg-card">
          <button
            type="button"
            onClick={() => setVerConferidos((v) => !v)}
            className="flex w-full items-center gap-2 px-4 py-3 text-left"
          >
            <span className="grid size-5 place-items-center rounded-full bg-success-soft text-success">
              <Check size={13} strokeWidth={2.5} />
            </span>
            <span className="text-sm font-medium">{conferidos.length} campos conferidos</span>
            <ChevronDown
              size={16}
              className={`ml-auto text-muted-foreground transition ${verConferidos ? 'rotate-180' : ''}`}
            />
          </button>
          {verConferidos && (
            <ul className="divide-y border-t">
              {conferidos.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-4 px-4 py-2.5">
                  <span className="text-sm text-muted-foreground">{f.label}</span>
                  <span className="truncate text-sm text-foreground">{valorLegivel(f)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Rodapé — o portão do envio */}
      <footer className="sticky bottom-0 z-20 border-t bg-card/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto w-full max-w-xl">
          <Button
            className="w-full"
            size="lg"
            disabled={temErro}
            iconRight={<SendHorizonal size={18} />}
            onClick={() => setEnviada(true)}
          >
            Enviar candidatura
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {temErro
              ? 'Resolva o currículo para liberar o envio.'
              : 'Nada é enviado sem você. CAPTCHA, se houver, aparece aqui para você resolver.'}
          </p>
        </div>
      </footer>
    </div>
  )
}

function valorLegivel(f: FormField): string {
  if (f.options) return f.options.find((o) => o.value === f.value)?.label ?? f.value
  if (f.type === 'checkbox') return f.value === 'sim' ? 'Sim' : 'Não'
  return f.value || '—'
}
