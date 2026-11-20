import { Mail } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { profile } from '@/lib/data'

function Linha({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="max-w-[60%] text-right text-sm text-foreground">{value}</span>
    </div>
  )
}

function Secao({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <h2 className="mb-1 text-sm font-semibold text-foreground">{title}</h2>
      <div className="divide-y">{children}</div>
    </section>
  )
}

export function Perfil() {
  return (
    <div>
      <PageHeader title="Seu perfil" subtitle="A fonte única que preenche cada candidatura e cadastro." />

      <div className="mb-4 flex items-center gap-4 rounded-xl border bg-card p-4">
        <span className="grid size-14 place-items-center rounded-full bg-brand-soft text-lg font-semibold text-brand-text">
          {profile.firstName.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <h2 className="truncate font-semibold">{profile.fullName}</h2>
          <p className="truncate text-sm text-muted-foreground">
            {profile.currentTitle} · {profile.yearsExperience} anos
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Secao title="Contato">
          <Linha label="E-mail" value={profile.email} />
          <Linha label="Telefone" value={profile.phone} />
          <Linha label="Local" value={`${profile.city} - ${profile.state}, ${profile.country}`} />
          <Linha label="LinkedIn" value={profile.linkedin} />
        </Secao>

        <Secao title="Profissional">
          <Linha label="Cargo atual" value={profile.currentTitle} />
          <Linha label="Pretensão salarial" value={profile.salaryExpectation} />
          <Linha label="Disponibilidade" value={profile.availability} />
          <Linha label="Inglês" value={profile.english} />
          <Linha label="Espanhol" value={profile.spanish} />
        </Secao>

        <Secao title="Respostas padrão">
          {profile.answers.map((a) => (
            <Linha key={a.label} label={a.label} value={a.value} />
          ))}
        </Secao>

        <p className="flex items-start gap-2 px-1 text-xs text-muted-foreground">
          <Mail size={14} className="mt-0.5 shrink-0" />
          Estes dados alimentam o preenchimento automático. No sistema real, cada correção vira aprendizado e não se repete.
        </p>
      </div>
    </div>
  )
}
