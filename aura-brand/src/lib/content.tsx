import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { brandKit, contentItems, credits, KIND_COST, KIND_LABEL, type Channel, type ContentItem, type ContentKind } from './data'

type Draft = { kind: ContentKind; channel: Channel; topic: string }
type ContentStore = {
  items: ContentItem[]
  creditsLeft: number
  creditsTotal: number
  /** Cria um rascunho e desconta os créditos. Devolve null se o saldo não cobre o custo. */
  generate: (draft: Draft) => ContentItem | null
  approve: (id: string) => void
  requestChange: (id: string) => void
  remove: (id: string) => void
}

const Ctx = createContext<ContentStore | null>(null)

/* Protótipo: o "gerador" monta a legenda com o tema e as palavras do brand kit. Não há IA ligada. */
function fakeCaption(topic: string) {
  const words = brandKit.values.slice(0, 2).join(' e ')
  return `${topic.trim().replace(/\.$/, '')}. ${brandKit.name}: ${words}, do nosso jeito.`
}

/* Estado de conteúdo compartilhado entre Início e Conteúdo, para a fila de aprovação ser uma só. */
export function ContentProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(contentItems)
  const [used, setUsed] = useState(credits.used)

  const store = useMemo<ContentStore>(() => {
    const setStatus = (id: string, patch: Partial<ContentItem>) => setItems((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)))
    return {
      items,
      creditsLeft: credits.total - used,
      creditsTotal: credits.total,
      generate: ({ kind, channel, topic }) => {
        const cost = KIND_COST[kind]
        if (credits.total - used < cost) return null
        const title = topic.trim().split(/[.!?\n]/)[0].slice(0, 60)
        const item: ContentItem = { id: crypto.randomUUID(), kind, channel, title: title || KIND_LABEL[kind], caption: fakeCaption(topic), status: 'aprovacao' }
        setItems((list) => [item, ...list])
        setUsed((u) => u + cost)
        return item
      },
      approve: (id) => setStatus(id, { status: 'agendado', when: 'horário a definir' }),
      requestChange: (id) => setStatus(id, { status: 'ajuste' }),
      remove: (id) => setItems((list) => list.filter((i) => i.id !== id)),
    }
  }, [items, used])

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useContent() {
  const store = useContext(Ctx)
  if (!store) throw new Error('useContent precisa estar dentro de ContentProvider')
  return store
}
