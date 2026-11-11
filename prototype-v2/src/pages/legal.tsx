import { Link } from 'react-router-dom'
import { Brand } from '@/components/app-shell'
import { legal } from '@/lib/legal'

export function Legal({ doc }: { doc: keyof typeof legal }) {
  const d = legal[doc]
  return (
    <div className="mx-auto min-h-svh max-w-2xl px-6 py-8">
      <Brand className="text-xl" />
      <main className="py-10">
        <h1 className="text-2xl font-semibold tracking-tight">{d.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Atualizado em {d.updated}. Texto de exemplo do protótipo.</p>
        <div className="mt-8 grid gap-6">
          {d.sections.map(([h, t], i) => (
            <section key={h}>
              <h2 className="text-base font-semibold">
                {i + 1}. {h}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t}</p>
            </section>
          ))}
        </div>
        <p className="mt-10 border-t pt-6 text-sm">
          <Link to="/login" className="font-medium text-brand-text underline-offset-4 hover:underline">
            Voltar para entrar
          </Link>
        </p>
      </main>
    </div>
  )
}
