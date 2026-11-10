import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { RoleProvider } from '@/lib/role'
import { ThemeProvider } from '@/lib/theme'
import { AlunoDetalhe, Alunos } from '@/pages/alunos'
import { Configuracoes } from '@/pages/configuracoes'
import { DesignSystem } from '@/pages/design-system'
import { Home } from '@/pages/home'
import { IA } from '@/pages/ia'
import { Login, VerifyEmail } from '@/pages/login'
import { Placeholder } from '@/pages/placeholder'

/* HashRouter: o build é estático e abre em qualquer hospedagem, sem configurar rotas no servidor. */
export default function App() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <TooltipProvider>
          <HashRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/verificar-email" element={<VerifyEmail />} />
              <Route element={<AppShell />}>
                <Route index element={<Navigate to="/inicio" replace />} />
                <Route path="/inicio" element={<Home />} />
                <Route path="/alunos" element={<Alunos />} />
                <Route path="/alunos/:id" element={<AlunoDetalhe />} />
                <Route path="/ia" element={<IA />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/design-system" element={<DesignSystem />} />
                <Route path="*" element={<Placeholder />} />
              </Route>
            </Routes>
          </HashRouter>
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </RoleProvider>
    </ThemeProvider>
  )
}
