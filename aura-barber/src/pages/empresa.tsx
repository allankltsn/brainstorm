import { useState } from 'react'
import { PageHeader, Panel } from '@/components/layout'
import { Button } from '@/components/affect/button'
import { TextField } from '@/components/affect/text-field'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { getEmpresa, updateEmpresa } from '@/lib/api'
import type { Empresa } from '@/lib/data'

export function EmpresaConfig() {
  const e = getEmpresa()
  const [nome, setNome] = useState(e.nome)
  const [slug, setSlug] = useState(e.slug)
  const [status, setStatus] = useState<Empresa['status']>(e.status)
  const [abertura, setAbertura] = useState(e.abertura)
  const [fechamento, setFechamento] = useState(e.fechamento)
  const [gradeMin, setGradeMin] = useState(String(e.gradeMin))
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null)

  const salvar = () => {
    const r = updateEmpresa({ nome, slug, status, abertura, fechamento, gradeMin: Number(gradeMin) })
    setMsg(r.ok ? { ok: true, texto: 'Alterações salvas — já valem na Agenda.' } : { ok: false, texto: r.erro ?? 'Erro.' })
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Empresa" subtitle="Dados do negócio e regras de horário." />

      <Panel className="space-y-4 p-5">
        <TextField label="Nome da barbearia" value={nome} onChange={(e) => { setNome(e.target.value); setMsg(null) }} />
        <TextField label="Identificador (slug)" value={slug} onChange={(e) => { setSlug(e.target.value); setMsg(null) }} />
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
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Abre às" type="time" value={abertura} onChange={(e) => { setAbertura(e.target.value); setMsg(null) }} />
          <TextField label="Fecha às" type="time" value={fechamento} onChange={(e) => { setFechamento(e.target.value); setMsg(null) }} />
        </div>
        <div>
          <p className="mb-1.5 text-sm text-muted-foreground">Grade da agenda</p>
          <SegmentedControl
            aria-label="Granularidade da grade"
            value={gradeMin}
            options={[
              { value: '15', label: '15 min' },
              { value: '30', label: '30 min' },
              { value: '60', label: '60 min' },
            ]}
            onChange={(v) => { setGradeMin(v); setMsg(null) }}
          />
        </div>
      </Panel>

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={salvar}>Salvar</Button>
        {msg && <span className={`text-sm ${msg.ok ? 'text-muted-foreground' : 'text-destructive'}`}>{msg.texto}</span>}
      </div>
    </div>
  )
}
