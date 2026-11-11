import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { BrandProvider } from '@/lib/brand'
import { ThemeProvider } from '@/lib/theme'
import { Configuracoes } from '@/pages/configuracoes'
import { DesignSystem } from '@/pages/design-system'
import { Inicio } from '@/pages/inicio'
import { Login, VerifyEmail } from '@/pages/login'
import { Marca } from '@/pages/marca'
import { Placeholder } from '@/pages/placeholder'

/* HashRouter: o build é estático e abre em qualquer hospedagem, sem configurar rotas no servidor. */
export default function App() {
  return (
    <ThemeProvider>
      <BrandProvider>
        <TooltipProvider>
          <HashRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/verificar-email" element={<VerifyEmail />} />
              <Route element={<AppShell />}>
                <Route index element={<Navigate to="/inicio" replace />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/marca" element={<Marca />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/design-system" element={<DesignSystem />} />
                <Route path="*" element={<Placeholder />} />
              </Route>
            </Routes>
          </HashRouter>
          <Toaster position="top-center" />
        </TooltipProvider>
      </BrandProvider>
    </ThemeProvider>
  )
}
