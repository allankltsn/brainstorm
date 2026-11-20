import { useState } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { PageHeader, Panel, Modal } from '@/components/layout'
import { Button } from '@/components/affect/button'
import { TextField } from '@/components/affect/text-field'
import { Select } from '@/components/affect/select'
import { db, type Disponibilidade, type Profissional } from '@/lib/data'
import { criarProfissional } from '@/lib/api'

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
type Rascunho = Omit<Profissional, 'id' | 'userId'> & { id?: string; userId?: string }
const vazio: Rascunho = { nome: '', servicos: [], disponibilidade: [], comissaoPct: 50 }

export function Profissionais() {
  const [lista, setLista] = useState<Profissional[]>(() => db.profissionais.map((p) => ({ ...p })))
  const [aberto, setAberto] = useState(false)
  const [draft, setDraft] = useState<Rascunho>(vazio)

  const abrirNovo = () => {
    setDraft({ ...vazio, disponibilidade: [] })
    setAberto(true)
  }
  const abrirEdicao = (p: Profissional) => {
    setDraft({ ...p, servicos: [...p.servicos], disponibilidade: p.disponibilidade.map((d) => ({ ...d })) })
    setAberto(true)
  }
  // grava no store compartilhado para refletir em Agenda/Agendar/Início
  const aplicar = (nova: Profissional[]) => {
    setLista(nova)
    db.replaceProfissionais(nova)
  }
  const excluir = (id: string) => aplicar(lista.filter((p) => p.id !== id))

  const salvar = () => {
    if (!draft.nome.trim()) return
    if (draft.id) {
      // edição: preserva o userId do profissional existente
      const nova = lista.map((p) => (p.id === draft.id ? ({ ...p, ...draft, id: draft.id, userId: p.userId } as Profissional) : p))
      aplicar(nova)
    } else {
      // novo: nasce como User + Membership(barbeiro) no store de identidade
      criarProfissional({
        nome: draft.nome.trim(),
        servicos: draft.servicos,
        disponibilidade: draft.disponibilidade,
        comissaoPct: draft.comissaoPct,
      })
      setLista(db.profissionais.map((p) => ({ ...p })))
    }
    setAberto(false)
  }

  const toggleServico = (sid: string) =>
    setDraft((d) => ({
      ...d,
      servicos: d.servicos.includes(sid) ? d.servicos.filter((x) => x !== sid) : [...d.servicos, sid],
    }))

  const addFaixa = () =>
    setDraft((d) => ({ ...d, disponibilidade: [...d.disponibilidade, { dia: 2, inicio: '09:00', fim: '18:00' }] }))
  const setFaixa = (i: number, patch: Partial<Disponibilidade>) =>
    setDraft((d) => ({ ...d, disponibilidade: d.disponibilidade.map((f, j) => (j === i ? { ...f, ...patch } : f)) }))
  const rmFaixa = (i: number) =>
    setDraft((d) => ({ ...d, disponibilidade: d.disponibilidade.filter((_, j) => j !== i) }))

  const nomeServico = (id: string) => db.servicoById(id)?.nome ?? id

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Profissionais"
        subtitle="Quem executa cada serviço, disponibilidade e comissão."
        action={
          <Button icon={<Plus size={16} />} onClick={abrirNovo}>
            Novo profissional
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {lista.map((p) => (
          <Panel key={p.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-foreground">{p.nome}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">Comissão {p.comissaoPct}%</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" icon={<Pencil size={15} />} onClick={() => abrirEdicao(p)} />
                <Button variant="ghost" size="sm" icon={<Trash2 size={15} />} onClick={() => excluir(p.id)} />
              </div>
            </div>
            <p className="mt-3 text-sm">
              <span className="text-muted-foreground">Serviços: </span>
              {p.servicos.map(nomeServico).join(', ') || '—'}
            </p>
            <p className="mt-1 text-sm">
              <span className="text-muted-foreground">Agenda: </span>
              {p.disponibilidade.length
                ? p.disponibilidade.map((d) => `${DIAS[d.dia]} ${d.inicio}–${d.fim}`).join(' · ')
                : '—'}
            </p>
          </Panel>
        ))}
      </div>

      <Modal
        open={aberto}
        onClose={() => setAberto(false)}
        title={draft.id ? 'Editar profissional' : 'Novo profissional'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={salvar}>Salvar</Button>
          </>
        }
      >
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <TextField label="Nome" value={draft.nome} onChange={(e) => setDraft({ ...draft, nome: e.target.value })} />
          </div>
          <TextField
            label="Comissão (%)"
            type="number"
            value={String(draft.comissaoPct)}
            onChange={(e) => setDraft({ ...draft, comissaoPct: Number(e.target.value) || 0 })}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Serviços que executa</p>
          <div className="flex flex-wrap gap-2">
            {db.servicos.map((s) => {
              const on = draft.servicos.includes(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleServico(s.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    on ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-foreground'
                  }`}
                >
                  {s.nome}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">Disponibilidade</p>
            <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={addFaixa}>
              Faixa
            </Button>
          </div>
          <div className="space-y-2">
            {draft.disponibilidade.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-28">
                  <Select
                    size="sm"
                    value={String(f.dia)}
                    options={DIAS.map((d, idx) => ({ value: String(idx), label: d }))}
                    onChange={(v) => setFaixa(i, { dia: Number(v) })}
                  />
                </div>
                <TextField size="sm" type="time" value={f.inicio} onChange={(e) => setFaixa(i, { inicio: e.target.value })} />
                <span className="text-muted-foreground">–</span>
                <TextField size="sm" type="time" value={f.fim} onChange={(e) => setFaixa(i, { fim: e.target.value })} />
                <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={() => rmFaixa(i)} />
              </div>
            ))}
            {draft.disponibilidade.length === 0 && (
              <p className="text-sm text-muted-foreground">Sem faixas — adicione os dias e horários de trabalho.</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
