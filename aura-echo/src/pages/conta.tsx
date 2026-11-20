import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useEcho } from '@/lib/store'
import { type Theme, useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

const OPCOES: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Escuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
]

export function Conta() {
  const { profile } = useEcho()
  const { theme, setTheme } = useTheme()

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Seus dados</h2>
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Nome</Label>
            <p className="text-[0.9375rem] font-medium">{profile.nome}</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground">E-mail</Label>
            <p className="text-[0.9375rem] font-medium">{profile.email}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Protótipo: troque de perfil pelo menu do usuário para ver outros dados.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Aparência</h2>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="grid grid-cols-3 gap-3">
            {OPCOES.map((o) => {
              const ativo = theme === o.value
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setTheme(o.value)}
                  aria-pressed={ativo}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors',
                    ativo ? 'border-primary bg-brand-soft text-brand-text' : 'border-border hover:bg-accent',
                  )}
                >
                  <o.icon className="size-5" />
                  {o.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
