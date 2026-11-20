import { useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { PageHeader, Panel, Modal } from '@/components/layout'
import { Button } from '@/components/affect/button'
import { TextField } from '@/components/affect/text-field'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { useRole } from '@/lib/role'
import { listFiliais, criarFilial, updateFilial, horarioValido } from '@/lib/api'
import type { Filial } from '@/lib/data'

export function Filiais() {
  const { role } = useRole()
  if (role !== 'dono') {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Filiais" subtitle="Unidades da barbearia." />
        <Panel className="p-5">
          <p className="text-sm text-muted-foreground">Apenas o dono gerencia as filiais.</p>
        </Panel>
      </div>
    )
  }
  return <FiliaisLista />
}

function FiliaisLista() {
  const [, setTick] = useState(0)
  const [aberto, setAberto] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [abertura, setAbertura] = useState('08:00')
  const [fechamento, setFechamento] = useState('20:00')
  const [gradeMin, setGradeMin] = useState('30')
  const [erro, setErro] = useState<string | null>(null)
  const lista = listFiliais()
  const refresh = () => setTick((t) => t + 1)

  const abrirNovo = () => {
    setEditId(null)
    setNome('')
    setAbertura('08:00')
    setFechamento('20:00')
    setGradeMin('30')
    setErro(null)
    setAberto(true)
  }
  const abrirEdicao = (f: Filial) => {
    setEditId(f.id)
    setNome(f.nome)
    setAbertura(f.abertura)
    setFechamento(f.fechamento)
    setGradeMin(String(f.gradeMin))
    setErro(null)
    setAberto(true)
  }

  const salvar = () => {
    if (!nome.trim()) return setErro('O nome da filial não pode ficar vazio.')
    if (!horarioValido(abertura, fechamento)) return setErro('A abertura precisa ser antes do fechamento.')
    const dados = { nome: nome.trim(), abertura, fechamento, gradeMin: Number(gradeMin) }
    const r = editId ? updateFilial(editId, dados) : criarFilial(dados)
    if (!r.ok) return setErro(r.erro ?? 'Erro.')
    refresh()
    setAberto(false)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Filiais"
        subtitle="Unidades da barbearia — cada uma com seu horário e grade."
        action={
          <Button icon={<Plus size={16} />} onClick={abrirNovo}>
            Nova filial
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {lista.map((f) => (
          <Panel key={f.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-foreground">{f.nome}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {f.abertura}–{f.fechamento} · grade {f.gradeMin} min
                </p>
              </div>
              <Button variant="ghost" size="sm" aria-label={`Editar ${f.nome}`} icon={<Pencil size={15} />} onClick={() => abrirEdicao(f)} />
            </div>
          </Panel>
        ))}
      </div>

      <Modal
        open={aberto}
        onClose={() => setAberto(false)}
        title={editId ? 'Editar filial' : 'Nova filial'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={salvar}>Salvar</Button>
          </>
        }
      >
        <TextField label="Nome" value={nome} onChange={(e) => { setNome(e.target.value); setErro(null) }} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Abre às" type="time" value={abertura} onChange={(e) => { setAbertura(e.target.value); setErro(null) }} />
          <TextField label="Fecha às" type="time" value={fechamento} onChange={(e) => { setFechamento(e.target.value); setErro(null) }} />
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
            onChange={(v) => { setGradeMin(v); setErro(null) }}
          />
        </div>
        {erro && <p className="text-sm text-destructive">{erro}</p>}
      </Modal>
    </div>
  )
}
