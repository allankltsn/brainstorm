import { Palette, PenLine, Settings, Sparkles } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/lightswind/command'
import { useAssistant } from '@/lib/assistant'
import { NAV } from '@/lib/nav'

/* Busca única (Ctrl/⌘ K): telas e ações no mesmo lugar. Usa o Command do Lightswind. */
export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate()
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
        ...NAV.map((n) => ({ key: n.to, label: n.label, icon: <n.icon />, run: go(n.to) })),
        { key: 'cfg', label: 'Configurações', words: 'conta assinatura tema avisos', icon: <Settings />, run: go('/configuracoes') },
        { key: 'kit', label: 'Kit de interface', words: 'design componentes', icon: <Palette />, run: go('/design-system') },
      ],
    },
  ]
  groups.push({
    heading: 'Ações',
    items: [
      { key: 'post', label: 'Criar post', words: 'novo conteúdo carrossel', icon: <PenLine />, run: go('/conteudo') },
      { key: 'kit-ia', label: 'Gerar brand kit com IA', words: 'marca briefing logo paleta', icon: <Sparkles />, run: go('/marca?aba=briefing') },
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
  })
  // O filtro fica aqui para esconder grupos vazios e só mostrar "nada encontrado" quando for verdade
  const shown = groups.map((g) => ({ ...g, items: g.items.filter((i) => match(`${i.label} ${i.words ?? ''} ${i.hint ?? ''}`)) })).filter((g) => g.items.length)

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar telas ou ações" value={q} onValueChange={setQ} />
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
