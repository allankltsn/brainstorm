import { CalendarClock, Dumbbell, LifeBuoy, ListChecks, Palette, Receipt, Ruler, Salad, Settings, Sparkles, UserPlus } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/lightswind/command'
import { useAssistant } from '@/lib/assistant'
import { students } from '@/lib/data'
import { NAV } from '@/lib/nav'
import { useRole } from '@/lib/role'

/* Busca única (Ctrl/⌘ K): telas, alunos e ações no mesmo lugar. Usa o Command do Lightswind. */
export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate()
  const { role } = useRole()
  const assistant = useAssistant()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  const [q, setQ] = useState('')
  useEffect(() => {
    if (!open) setQ('')
  }, [open])

  const close = () => onOpenChange(false)
  const go = (to: string) => () => {
    close()
    navigate(to)
  }
  const norm = (t: string) =>
    t
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  const match = (text: string) => norm(text).includes(norm(q.trim()))

  type Entry = { key: string; label: string; words?: string; icon: ReactNode; hint?: string; run: () => void }
  const groups: { heading: string; items: Entry[] }[] = [
    {
      heading: 'Ir para',
      items: [
        ...NAV[role].map((n) => ({ key: n.to, label: n.label, icon: <n.icon />, run: go(n.to) })),
        { key: 'cfg', label: 'Configurações', words: 'conta assinatura tema avisos', icon: <Settings />, run: go('/configuracoes') },
        { key: 'suporte', label: 'Ajuda e suporte', words: 'dúvidas contato problema', icon: <LifeBuoy />, run: go('/suporte') },
        ...(role === 'personal'
          ? [
              { key: 'cobrancas', label: 'Cobranças dos alunos', words: 'mensalidade financeiro pagamento pix', icon: <Receipt />, run: go('/cobrancas') },
              { key: 'creditos', label: 'Créditos de IA', words: 'saldo inteligência artificial', icon: <Sparkles />, run: go('/ia/creditos') },
              { key: 'agenda', label: 'Agenda', words: 'sessões horário marcar calendário', hint: 'Em breve', icon: <CalendarClock />, run: go('/em-breve/agenda') },
              { key: 'nutricao', label: 'Nutrição', words: 'alimentação dieta', hint: 'Em breve', icon: <Salad />, run: go('/em-breve/nutricao') },
            ]
          : []),
        ...(role === 'aluno'
          ? [
              { key: 'checkin', label: 'Fazer check-in', words: 'peso medidas fotos', icon: <Ruler />, run: go('/check-in') },
              { key: 'pagamentos', label: 'Pagamentos', words: 'mensalidade pix', icon: <Receipt />, run: go('/pagamentos') },
              { key: 'passos', label: 'Primeiros passos', words: 'começar checklist', icon: <ListChecks />, run: go('/primeiros-passos') },
            ]
          : []),
        { key: 'kit', label: 'Kit de interface', words: 'design componentes', icon: <Palette />, run: go('/design-system') },
      ],
    },
  ]
  if (role === 'personal') {
    groups.push(
      {
        heading: 'Ações',
        items: [
          {
            key: 'convidar',
            label: 'Convidar aluno',
            words: 'novo',
            icon: <UserPlus />,
            run: () => {
              close()
              toast.success('Convite enviado', { description: 'Você será avisado quando a pessoa aceitar.' })
            },
          },
          { key: 'criar', label: 'Criar treino', words: 'novo modelo', icon: <Dumbbell />, run: go('/treinos/novo') },
          { key: 'ia', label: 'Sugerir treino com IA', words: 'inteligência artificial', icon: <Sparkles />, run: go('/ia') },
          {
            key: 'aura',
            label: 'Perguntar para a Aura',
            words: 'assistente ajuda',
            icon: <Sparkles />,
            run: () => {
              close()
              assistant.setOpen(true)
            },
          },
        ],
      },
      {
        heading: 'Alunos',
        items: students
          .filter((s) => s.status !== 'encerrado')
          .map((s) => ({
            key: s.id,
            label: s.name,
            hint: s.plan ?? 'Sem treino',
            icon: <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium">{s.name[0]}</span>,
            run: go(`/alunos/${s.id}`),
          })),
      },
    )
  }
  // O filtro fica aqui para esconder grupos vazios e só mostrar "nada encontrado" quando for verdade
  const shown = groups.map((g) => ({ ...g, items: g.items.filter((i) => match(`${i.label} ${i.words ?? ''} ${i.hint ?? ''}`)) })).filter((g) => g.items.length)

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar telas, alunos ou ações" value={q} onValueChange={setQ} />
      <CommandList>
        {shown.length === 0 && <CommandEmpty>Nada encontrado. Tente outro nome.</CommandEmpty>}
        {shown.map((g) => (
          <CommandGroup key={g.heading} heading={g.heading}>
            {g.items.map((i) => (
              <CommandItem key={i.key} value={`${i.label} ${i.words ?? ''} ${i.hint ?? ''}`} onSelect={i.run} className="gap-2.5 text-sm [&_svg]:size-4 [&_svg]:text-muted-foreground">
                {i.icon}
                {i.label}
                {i.hint && <span className="ml-auto text-xs text-muted-foreground">{i.hint}</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
