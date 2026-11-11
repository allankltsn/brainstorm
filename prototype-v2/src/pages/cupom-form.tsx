import { ArrowLeft } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { Select } from '@/components/affect/select'
import { Switch } from '@/components/affect/switch'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Section } from '@/components/page'
import { coupons, plans } from '@/lib/billing'

type Errors = Partial<Record<'code' | 'off' | 'limit', string>>

export function CupomForm() {
  const { code } = useParams()
  const navigate = useNavigate()
  const c = coupons.find((x) => x.code === code)
  const [f, setF] = useState({ code: c?.code ?? '', off: c ? String(c.off * 100) : '', limit: c ? String(c.limit) : '', ends: c?.ends ?? '' })
  const [plan, setPlan] = useState<string | null>(c?.plan ?? 'Todos')
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    if (!/^[A-Z0-9]{4,16}$/.test(f.code)) next.code = 'Use de 4 a 16 letras maiúsculas ou números, sem espaço.'
    else if (!c && coupons.some((x) => x.code === f.code)) next.code = 'Já existe um cupom com este código.'
    const off = Number(f.off)
    if (!(off >= 1 && off <= 100)) next.off = 'Informe um desconto de 1 a 100.'
    if (!(Number(f.limit) >= 1)) next.limit = 'Informe quantas vezes o cupom pode ser usado.'
    setErrors(next)
    if (Object.keys(next).length) return
    setSaving(true)
    setTimeout(() => {
      toast.success(c ? 'Cupom salvo' : 'Cupom criado')
      navigate('/planos?aba=cupons')
    }, 800)
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link to="/planos?aba=cupons" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Cupons
      </Link>
      <PageHeader title={c ? `Editar cupom ${c.code}` : 'Novo cupom'} description={c && c.uses ? `Já foi usado ${c.uses} vezes. O código não pode mais mudar.` : 'O desconto vale na primeira cobrança.'} />
      <form onSubmit={submit} noValidate>
        <Section title="Dados do cupom">
          <div className="grid gap-5">
            <TextField label="Código" value={f.code} readOnly={!!c?.uses} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} error={errors.code} placeholder="Ex.: VERAO15" />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Desconto" inputMode="numeric" suffix="%" value={f.off} onChange={(e) => setF({ ...f, off: e.target.value })} error={errors.off} />
              <TextField label="Limite de usos" inputMode="numeric" value={f.limit} onChange={(e) => setF({ ...f, limit: e.target.value })} error={errors.limit} />
            </div>
            <Select
              label="Vale para"
              value={plan}
              onChange={setPlan}
              options={[{ value: 'Todos', label: 'Todos os planos' }, ...plans.filter((p) => p.monthly > 0 && p.status === 'publicado').map((p) => ({ value: p.name, label: `Plano ${p.name}` }))]}
            />
            <TextField label="Válido até" optional placeholder="DD/MM/AAAA" value={f.ends} onChange={(e) => setF({ ...f, ends: e.target.value })} />
            <Switch placement="end" label="Ativo" description="Desligado, ninguém consegue usar o cupom." defaultChecked={c?.active ?? true} />
          </div>
        </Section>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/planos?aba=cupons')}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {saving ? 'Salvando' : c ? 'Salvar cupom' : 'Criar cupom'}
          </Button>
        </div>
      </form>
    </div>
  )
}
