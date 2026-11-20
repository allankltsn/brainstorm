import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { PageHeader, Panel, Modal, brl } from '@/components/layout'
import { Button } from '@/components/affect/button'
import { TextField } from '@/components/affect/text-field'
import { db, type Servico } from '@/lib/data'

type Rascunho = Omit<Servico, 'id'> & { id?: string }

const vazio: Rascunho = { nome: '', duracaoMin: 30, precoBRL: 0, categoria: '', executores: [] }

export function Servicos() {
  const [lista, setLista] = useState<Servico[]>(() => db.servicos.map((s) => ({ ...s })))
  const [aberto, setAberto] = useState(false)
  const [draft, setDraft] = useState<Rascunho>(vazio)

  const abrirNovo = () => {
    setDraft({ ...vazio })
    setAberto(true)
  }
  const abrirEdicao = (s: Servico) => {
    setDraft({ ...s })
    setAberto(true)
  }
  // grava no store compartilhado para refletir em Agenda/Agendar/Início
  const aplicar = (nova: Servico[]) => {
    setLista(nova)
    db.replaceServicos(nova)
  }
  const excluir = (id: string) => aplicar(lista.filter((s) => s.id !== id))

  const salvar = () => {
    if (!draft.nome.trim()) return
    const nova = draft.id
      ? lista.map((s) => (s.id === draft.id ? ({ ...draft, id: draft.id } as Servico) : s))
      : [...lista, { ...draft, id: `s-${Date.now()}` }]
    aplicar(nova)
    setAberto(false)
  }

  const toggleExecutor = (pid: string) =>
    setDraft((d) => ({
      ...d,
      executores: d.executores.includes(pid) ? d.executores.filter((x) => x !== pid) : [...d.executores, pid],
    }))

  const nomeProf = (id: string) => db.profissionalById(id)?.nome ?? id

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Serviços"
        subtitle="Catálogo da barbearia — duração e preço alimentam a agenda."
        action={
          <Button icon={<Plus size={16} />} onClick={abrirNovo}>
            Novo serviço
          </Button>
        }
      />

      <Panel>
        <table className="w-full text-sm">
          <thead className="border-b text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Serviço</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Duração</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Profissionais</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {lista.map((s) => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{s.nome}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.categoria || '—'}</td>
                <td className="px-4 py-3">{s.duracaoMin} min</td>
                <td className="px-4 py-3">{brl(s.precoBRL)}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.executores.map(nomeProf).join(', ') || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" icon={<Pencil size={15} />} onClick={() => abrirEdicao(s)} />
                    <Button variant="ghost" size="sm" icon={<Trash2 size={15} />} onClick={() => excluir(s.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Nenhum serviço ainda. Crie o primeiro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>

      <Modal
        open={aberto}
        onClose={() => setAberto(false)}
        title={draft.id ? 'Editar serviço' : 'Novo serviço'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={salvar}>Salvar</Button>
          </>
        }
      >
        <TextField label="Nome" value={draft.nome} onChange={(e) => setDraft({ ...draft, nome: e.target.value })} />
        <div className="grid grid-cols-3 gap-3">
          <TextField
            label="Duração (min)"
            type="number"
            value={String(draft.duracaoMin)}
            onChange={(e) => setDraft({ ...draft, duracaoMin: Number(e.target.value) || 0 })}
          />
          <TextField
            label="Preço (R$)"
            type="number"
            value={String(draft.precoBRL)}
            onChange={(e) => setDraft({ ...draft, precoBRL: Number(e.target.value) || 0 })}
          />
          <TextField
            label="Categoria"
            value={draft.categoria}
            onChange={(e) => setDraft({ ...draft, categoria: e.target.value })}
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Profissionais que executam</p>
          <div className="flex flex-wrap gap-2">
            {db.profissionais.map((p) => {
              const on = draft.executores.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleExecutor(p.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    on ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-foreground'
                  }`}
                >
                  {p.nome}
                </button>
              )
            })}
          </div>
        </div>
      </Modal>
    </div>
  )
}
