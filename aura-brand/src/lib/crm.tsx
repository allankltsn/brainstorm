import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { campaigns as seedCampaigns, conversations as seedConversations, forms as seedForms, leads as seedLeads, type Campaign, type Conversation, type Lead, type LeadForm, type Stage } from './crm-data'

type CrmStore = {
  leads: Lead[]
  forms: LeadForm[]
  conversations: Conversation[]
  campaigns: Campaign[]
  addLead: (lead: Omit<Lead, 'id' | 'stage'>) => void
  moveLead: (id: string, stage: Stage) => void
  addForm: (name: string, fields: string[]) => void
  toggleForm: (id: string, active: boolean) => void
  markRead: (id: string) => void
  reply: (id: string, text: string) => void
  addCampaign: (c: Omit<Campaign, 'id' | 'status' | 'recipients'>) => Campaign
  /** Quem recebe uma campanha: leads do segmento que deram consentimento (LGPD). */
  audience: (segment: Campaign['segment']) => Lead[]
}

const Ctx = createContext<CrmStore | null>(null)
const timeFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })

/* Estado de leads, formulários, conversas e campanhas, compartilhado entre as telas. */
export function CrmProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState(seedLeads)
  const [forms, setForms] = useState(seedForms)
  const [conversations, setConversations] = useState(seedConversations)
  const [campaigns, setCampaigns] = useState(seedCampaigns)

  const store = useMemo<CrmStore>(() => {
    const audience: CrmStore['audience'] = (segment) => leads.filter((l) => l.consent && l.stage !== 'perdido' && (segment === 'todos' || l.stage === segment))
    return {
      leads,
      forms,
      conversations,
      campaigns,
      audience,
      addLead: (lead) => setLeads((list) => [{ ...lead, id: crypto.randomUUID(), stage: 'novo' }, ...list]),
      moveLead: (id, stage) => setLeads((list) => list.map((l) => (l.id === id ? { ...l, stage } : l))),
      addForm: (name, fields) => setForms((list) => [{ id: crypto.randomUUID(), name, fields, leads: 0, active: true }, ...list]),
      toggleForm: (id, active) => setForms((list) => list.map((f) => (f.id === id ? { ...f, active } : f))),
      markRead: (id) => setConversations((list) => list.map((c) => (c.id === id && c.unread ? { ...c, unread: false } : c))),
      reply: (id, text) =>
        setConversations((list) =>
          list.map((c) => (c.id === id ? { ...c, unread: false, messages: [...c.messages, { id: crypto.randomUUID(), from: 'marca', text, time: timeFmt.format(new Date()) }] } : c)),
        ),
      addCampaign: (c) => {
        const campaign: Campaign = { ...c, id: crypto.randomUUID(), status: 'rascunho', recipients: audience(c.segment).length }
        setCampaigns((list) => [campaign, ...list])
        return campaign
      },
    }
  }, [leads, forms, conversations, campaigns])

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useCrm() {
  const store = useContext(Ctx)
  if (!store) throw new Error('useCrm precisa estar dentro de CrmProvider')
  return store
}
