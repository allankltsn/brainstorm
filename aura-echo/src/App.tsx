import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CriarConta, Entrar } from '@/pages/entrar'
import { Inicio } from '@/pages/inicio'
import { Landing } from '@/pages/landing'
import { Assinatura } from '@/pages/assinatura'
import { Loja } from '@/pages/loja'
import { ServicoDetalhe } from '@/pages/servico-detalhe'
import { NaoEncontrada } from '@/pages/nao-encontrada'
import { EchoProvider } from '@/lib/store'
import { ThemeProvider } from '@/lib/theme'

const Placeholder = ({ nome }: { nome: string }) => (
  <div className="rounded-xl border border-dashed border-border p-8 text-muted-foreground">{nome} — em construção</div>
)

/* HashRouter: o build é estático e abre em qualquer hospedagem, sem rota no servidor. */
export default function App() {
  return (
    <ThemeProvider>
      <EchoProvider>
        <TooltipProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/entrar" element={<Entrar />} />
              <Route path="/criar-conta" element={<CriarConta />} />
              <Route path="/app" element={<AppShell />}>
                <Route index element={<Navigate to="/app/inicio" replace />} />
                <Route path="inicio" element={<Inicio />} />
                <Route path="loja" element={<Loja />} />
                <Route path="loja/:slug" element={<ServicoDetalhe />} />
                <Route path="assinatura" element={<Assinatura />} />
                <Route path="conta" element={<Placeholder nome="Conta" />} />
              </Route>
              <Route path="*" element={<NaoEncontrada />} />
            </Routes>
            <Toaster />
          </HashRouter>
        </TooltipProvider>
      </EchoProvider>
    </ThemeProvider>
  )
}
