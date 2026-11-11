import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { RoleProvider, useRole } from '@/lib/role'
import { ThemeProvider } from '@/lib/theme'
import { AlunoDetalhe, Alunos } from '@/pages/alunos'
import { Configuracoes } from '@/pages/configuracoes'
import { DesignSystem } from '@/pages/design-system'
import { Home } from '@/pages/home'
import { IA } from '@/pages/ia'
import { Login, VerifyEmail } from '@/pages/login'
import { Acompanhamento } from '@/pages/acompanhamento'
import { Mensagens } from '@/pages/mensagens'
import { AceitarConvite } from '@/pages/aceitar-convite'
import { AdminPlanos } from '@/pages/admin-planos'
import { AlunoVinculo } from '@/pages/aluno-vinculo'
import { CupomRelatorio } from '@/pages/cupom-relatorio'
import { DadosIA } from '@/pages/dados-ia'
import { EnviarQuestionario } from '@/pages/enviar-questionario'
import { ImportarTreino } from '@/pages/importar-treino'
import { Legal } from '@/pages/legal'
import { ModeloQuestionario } from '@/pages/modelo-questionario'
import { Permissoes } from '@/pages/permissoes'
import { SelecionarPerfil } from '@/pages/selecionar-perfil'
import { Manutencao, SessaoExpirada } from '@/pages/sessao-expirada'
import { TreinoFeito } from '@/pages/treino-feito'
import { UsuarioDetalhe } from '@/pages/usuario-detalhe'
import { Cadastro } from '@/pages/cadastro'
import { CancelarAssinatura } from '@/pages/cancelar-assinatura'
import { ConvidarAluno } from '@/pages/convidar-aluno'
import { EsqueciSenha } from '@/pages/esqueci-senha'
import { MeuTreino } from '@/pages/meu-treino'
import { NaoEncontrada } from '@/pages/nao-encontrada'
import { Notificacoes } from '@/pages/notificacoes'
import { Planos } from '@/pages/planos'
import { RedefinirSenha } from '@/pages/redefinir-senha'
import { RespostaQuestionario } from '@/pages/resposta-questionario'
import { Usuarios } from '@/pages/usuarios'
import { ExercicioDetalhe, ExercicioForm } from '@/pages/exercicio'
import { TreinoEditor } from '@/pages/treino-editor'
import { Treinos } from '@/pages/treinos'

function PlanosPorPerfil() {
  return useRole().role === 'admin' ? <AdminPlanos /> : <Planos />
}

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
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/convite" element={<AceitarConvite />} />
              <Route path="/selecionar-perfil" element={<SelecionarPerfil />} />
              <Route path="/sessao-expirada" element={<SessaoExpirada />} />
              <Route path="/manutencao" element={<Manutencao />} />
              <Route path="/termos" element={<Legal doc="termos" />} />
              <Route path="/privacidade" element={<Legal doc="privacidade" />} />
              <Route path="/esqueci-senha" element={<EsqueciSenha />} />
              <Route path="/redefinir-senha" element={<RedefinirSenha />} />
              <Route element={<AppShell />}>
                <Route index element={<Navigate to="/inicio" replace />} />
                <Route path="/inicio" element={<Home />} />
                <Route path="/alunos" element={<Alunos />} />
                <Route path="/alunos/:id" element={<AlunoDetalhe />} />
                <Route path="/alunos/:id/vinculo" element={<AlunoVinculo />} />
                <Route path="/convidar-aluno" element={<ConvidarAluno />} />
                <Route path="/treino" element={<MeuTreino />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/usuarios/permissoes" element={<Permissoes />} />
                <Route path="/usuarios/:id" element={<UsuarioDetalhe />} />
                <Route path="/planos/cupons/:code" element={<CupomRelatorio />} />
                <Route path="/treinos/importar" element={<ImportarTreino />} />
                <Route path="/ia/dados" element={<DadosIA />} />
                <Route path="/acompanhamento/treinos/:id" element={<TreinoFeito />} />
                <Route path="/acompanhamento/questionarios/enviar" element={<EnviarQuestionario />} />
                <Route path="/acompanhamento/questionarios/modelo" element={<ModeloQuestionario />} />
                <Route path="/planos" element={<PlanosPorPerfil />} />
                <Route path="/assinatura/cancelar" element={<CancelarAssinatura />} />
                <Route path="/avisos" element={<Notificacoes />} />
                <Route path="/treinos" element={<Treinos />} />
                <Route path="/treinos/novo" element={<TreinoEditor />} />
                <Route path="/treinos/exercicios/novo" element={<ExercicioForm />} />
                <Route path="/treinos/exercicios/:id" element={<ExercicioDetalhe />} />
                <Route path="/treinos/exercicios/:id/editar" element={<ExercicioForm />} />
                <Route path="/treinos/:id" element={<TreinoEditor />} />
                <Route path="/acompanhamento" element={<Acompanhamento />} />
                <Route path="/acompanhamento/respostas/:id" element={<RespostaQuestionario />} />
                <Route path="/mensagens" element={<Mensagens />} />
                <Route path="/ia" element={<IA />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/design-system" element={<DesignSystem />} />
                <Route path="*" element={<NaoEncontrada />} />
              </Route>
            </Routes>
          </HashRouter>
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </RoleProvider>
    </ThemeProvider>
  )
}
