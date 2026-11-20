import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'
import { ThemeProvider } from '@/lib/theme'
import { RoleProvider } from '@/lib/role'
import { Agenda } from '@/pages/agenda'
import { Agendar } from '@/pages/agendar'
import { Home } from '@/pages/home'
import { NaoEncontrada } from '@/pages/nao-encontrada'
import { Profissionais } from '@/pages/profissionais'
import { Servicos } from '@/pages/servicos'

/* HashRouter: build estático abre em qualquer hospedagem (GitHub Pages, arquivo local). */
export default function App() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <HashRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Navigate to="/inicio" replace />} />
              <Route path="/inicio" element={<Home />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/agendar" element={<Agendar />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/profissionais" element={<Profissionais />} />
              <Route path="*" element={<NaoEncontrada />} />
            </Route>
          </Routes>
        </HashRouter>
      </RoleProvider>
    </ThemeProvider>
  )
}
