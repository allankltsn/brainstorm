import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'
import { ThemeProvider } from '@/lib/theme'
import { RoleProvider } from '@/lib/role'
import { Agenda } from '@/pages/agenda'
import { Agendar } from '@/pages/agendar'
import { Home } from '@/pages/home'
import { MeusHorarios } from '@/pages/meus-horarios'
import { Config } from '@/pages/config'
import { MeuUsuario } from '@/pages/meu-usuario'
import { EmpresaConfig } from '@/pages/empresa'
import { NaoEncontrada } from '@/pages/nao-encontrada'
import { Profissionais } from '@/pages/profissionais'
import { Servicos } from '@/pages/servicos'
import { Clientes } from '@/pages/clientes'

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
              <Route path="/meus-horarios" element={<MeusHorarios />} />
              <Route path="/config" element={<Config />} />
              <Route path="/meu-usuario" element={<MeuUsuario />} />
              <Route path="/empresa" element={<EmpresaConfig />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/profissionais" element={<Profissionais />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="*" element={<NaoEncontrada />} />
            </Route>
          </Routes>
        </HashRouter>
      </RoleProvider>
    </ThemeProvider>
  )
}
