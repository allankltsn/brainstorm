import { CheckCircle2, Lock, RefreshCw } from 'lucide-react'
import { Brand } from '@/components/app-shell'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Brand className="text-xl" />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">{children}</div>
        <p className="text-xs text-muted-foreground">Protótipo de testes. Todos os dados são fictícios.</p>
      </div>
      <aside className="relative hidden overflow-hidden bg-zinc-950 p-12 text-zinc-50 lg:flex lg:flex-col lg:justify-end">
        <div aria-hidden="true" className="absolute -top-40 -right-40 size-[36rem] rounded-full bg-primary/50 blur-[120px]" />
        <div aria-hidden="true" className="absolute -bottom-56 -left-32 size-[30rem] rounded-full bg-primary/25 blur-[120px]" />
        <div className="relative max-w-md">
          <h2 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance">Mais que treinos. Resultados reais.</h2>
          <p className="mt-4 text-base text-zinc-300">O espaço do personal para cuidar dos alunos, dos treinos e das cobranças.</p>
          <ul className="mt-8 grid gap-3 text-sm text-zinc-200">
            {[
              [CheckCircle2, 'Convite seguro para cada aluno'],
              [Lock, 'Seus dados protegidos, como manda a LGPD'],
              [RefreshCw, 'Cancele a assinatura quando quiser'],
            ].map(([Icon, text]) => (
              <li key={text as string} className="flex items-center gap-3">
                <Icon className="size-4.5 text-zinc-400" />
                {text as string}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
