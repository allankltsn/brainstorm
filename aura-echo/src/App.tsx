import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Landing } from '@/pages/landing'
import { NaoEncontrada } from '@/pages/nao-encontrada'
import { ThemeProvider } from '@/lib/theme'

/* HashRouter: o build é estático e abre em qualquer hospedagem, sem rota no servidor. */
export default function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Navigate to="/app/inicio" replace />} />
              <Route path="inicio" element={<div className="p-8 text-muted-foreground">Portal (em construção — ECO-05)</div>} />
            </Route>
            <Route path="*" element={<NaoEncontrada />} />
          </Routes>
        </HashRouter>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  )
}
