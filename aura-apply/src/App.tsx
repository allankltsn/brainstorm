import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'
import { ThemeProvider } from '@/lib/theme'
import { Vagas } from '@/pages/vagas'
import { Revisao } from '@/pages/revisao'
import { Candidaturas } from '@/pages/candidaturas'
import { Perfil } from '@/pages/perfil'
import { NaoEncontrada } from '@/pages/nao-encontrada'

/* HashRouter: build estático abre em qualquer hospedagem (GitHub Pages, arquivo local). */
export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/vagas" replace />} />
            <Route path="/vagas" element={<Vagas />} />
            <Route path="/candidaturas" element={<Candidaturas />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>
          {/* A revisão abre em aba própria, em tela cheia (sem o shell) */}
          <Route path="/revisao/:id" element={<Revisao />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}
