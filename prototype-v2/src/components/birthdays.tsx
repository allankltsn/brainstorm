import { Cake, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { TextArea } from '@/components/affect/text-area'
import { Person, Pill, Section } from '@/components/page'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { firstName } from '@/lib/data'
import { birthdayDraft, birthdays } from '@/lib/engagement'
import { dateDayMonth } from '@/lib/format'

type Birthday = (typeof birthdays)[number]

const whenLabel = (b: Birthday) => (b.inDays === 0 ? 'Hoje' : b.inDays === 1 ? 'Amanhã' : `Em ${b.inDays} dias`)

/* Aniversários dos próximos 7 dias, com mensagem pronta. Nada é enviado sem o personal aprovar. */
export function Birthdays({ className }: { className?: string }) {
  const [sent, setSent] = useState<string[]>([])
  const [open, setOpen] = useState<Birthday | null>(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  return (
    <Section title="Aniversários" description="Próximos 7 dias" className={className}>
      {birthdays.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum aniversário nesta semana.</p>
      ) : (
        <ul className="grid gap-4">
          {birthdays.map((b) => (
            <li key={b.sid} className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <Link to={`/alunos/${b.sid}`} className="min-w-0 flex-1 basis-40 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Person name={b.name} sub={`${dateDayMonth(b.day)} · faz ${b.age} anos`} size="sm" />
              </Link>
              {sent.includes(b.sid) ? (
                <Pill tone="success">Parabéns enviado</Pill>
              ) : b.inDays === 0 ? (
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<MessageSquare />}
                  onClick={() => {
                    setDraft(birthdayDraft(firstName(b.name)))
                    setOpen(b)
                  }}
                >
                  Dar parabéns
                </Button>
              ) : (
                <Pill icon={<Cake />}>{whenLabel(b)}</Pill>
              )}
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Parabéns para {open && firstName(open.name)}</DialogTitle>
            <DialogDescription>Um rascunho para você ajustar. Vai pelas mensagens do app.</DialogDescription>
          </DialogHeader>
          <TextArea aria-label="Mensagem de parabéns" minRows={3} maxRows={8} maxLength={400} counter value={draft} onChange={(e) => setDraft(e.target.value)} />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(null)}>
              Agora não
            </Button>
            <Button
              loading={sending}
              disabled={!draft.trim()}
              onClick={() => {
                setSending(true)
                setTimeout(() => {
                  if (open) {
                    setSent((l) => [...l, open.sid])
                    toast.success(`Parabéns enviado para ${firstName(open.name)}`)
                  }
                  setSending(false)
                  setOpen(null)
                }, 800)
              }}
            >
              {sending ? 'Enviando' : 'Enviar parabéns'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Section>
  )
}
