import { useState } from 'react'
import { PageHeader, Panel } from '@/components/layout'
import { Button } from '@/components/affect/button'
import { TextField } from '@/components/affect/text-field'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { useRole } from '@/lib/role'
import { getEmpresa, updateEmpresa } from '@/lib/api'
import type { Empresa } from '@/lib/data'

export function EmpresaConfig() {
  const { role } = useRole()
  if (role !== 'dono') {
    return (
      <div className="mx-auto max-w-xl">
        <PageHeader title="Empresa" subtitle="Configuração do negócio." />
        <Panel className="p-5">
          <p className="text-sm text-muted-foreground">Apenas o dono pode configurar a empresa.</p>
        </Panel>
      </div>
    )
  }
  return <EmpresaForm />
}

function EmpresaForm() {
  const e = getEmpresa()
  const [nome, setNome] = useState(e.nome)
  const [slug, setSlug] = useState(e.slug)
  const [status, setStatus] = useState<Empresa['status']>(e.status)
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null)

  const salvar = () => {
    const r = updateEmpresa({ nome, slug, status })
    setMsg(r.ok ? { ok: true, texto: 'Alterações salvas.' } : { ok: false, texto: r.erro ?? 'Erro.' })
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Empresa" subtitle="A marca que agrega as filiais." />

      <Panel className="space-y-4 p-5">
        <TextField label="Nome da marca" value={nome} onChange={(ev) => { setNome(ev.target.value); setMsg(null) }} />
        <TextField label="Identificador (slug)" value={slug} onChange={(ev) => { setSlug(ev.target.value); setMsg(null) }} />
        <div>
          <p className="mb-1.5 text-sm text-muted-foreground">Status</p>
          <SegmentedControl
            aria-label="Status da empresa"
            value={status}
            options={[
              { value: 'ACTIVE', label: 'Ativa' },
              { value: 'SUSPENDED', label: 'Suspensa' },
            ]}
            onChange={(v) => { setStatus(v as Empresa['status']); setMsg(null) }}
          />
        </div>
        <p className="text-sm text-muted-foreground">Horário e grade da agenda agora são definidos por filial, em <span className="text-foreground">Filiais</span>.</p>
      </Panel>

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={salvar}>Salvar</Button>
        {msg && <span className={`text-sm ${msg.ok ? 'text-muted-foreground' : 'text-destructive'}`}>{msg.texto}</span>}
      </div>
    </div>
  )
}
