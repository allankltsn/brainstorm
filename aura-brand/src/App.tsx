import { MotionConfig } from 'framer-motion'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ContentProvider } from '@/lib/content'
import { CrmProvider } from '@/lib/crm'
import { ThemeProvider } from '@/lib/theme'
import { Conteudo } from '@/pages/conteudo'
import { Inicio } from '@/pages/inicio'
import { Leads } from '@/pages/leads'
import { Marca } from '@/pages/marca'
import { Mensagens } from '@/pages/mensagens'
import { Placeholder } from '@/pages/placeholder'

/* HashRouter: o build é estático e abre em qualquer hospedagem, sem configurar rotas no servidor. */
export default function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          <HashRouter>
            <Routes>
              <Route
                element={
                  <ContentProvider>
                    <CrmProvider>
                      <AppShell />
                    </CrmProvider>
                  </ContentProvider>
                }
              >
                <Route index element={<Navigate to="/inicio" replace />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/marca" element={<Marca />} />
                <Route path="/conteudo" element={<Conteudo />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/mensagens" element={<Mensagens />} />
                <Route path="*" element={<Placeholder />} />
              </Route>
            </Routes>
          </HashRouter>
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
