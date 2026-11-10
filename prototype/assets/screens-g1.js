/* screens-g1.js - galeria do G1 (Acesso e institucional). Mesmo formato de screens.js. */
window.SCREENS = window.SCREENS || [];
window.SCREENS.push(
  { group: 'G1 · Autenticação', title: 'AUTH-01 · Login', path: 'screens/auth/login.html', role: 'aluno', note: 'Variantes: credenciais-invalidas, muitas-tentativas, conta-bloqueada, veio-de-sessao-expirada.' },
  { group: 'G1 · Autenticação', title: 'AUTH-02 · Cadastro de personal', path: 'screens/auth/cadastro-personal.html', role: 'personal', note: 'Variantes: email-em-uso, senha-fraca, senhas-diferentes.' },
  { group: 'G1 · Autenticação', title: 'AUTH-03 · Aceitar convite', path: 'screens/auth/aceitar-convite.html', role: 'aluno', note: 'Variantes: expirado, ja-usado, revogado, ja-tem-conta, menor-de-idade, sem-link.' },
  { group: 'G1 · Autenticação', title: 'AUTH-04 · Esqueci a senha', path: 'screens/auth/esqueci-senha.html', role: 'aluno', note: 'Variante: email-invalido.' },
  { group: 'G1 · Autenticação', title: 'AUTH-05 · Link enviado', path: 'screens/auth/link-enviado.html', role: 'aluno', note: 'Variante: reenvio-aguardando.' },
  { group: 'G1 · Autenticação', title: 'AUTH-06 · Redefinir senha', path: 'screens/auth/redefinir-senha.html', role: 'aluno', note: 'Variantes: link-expirado, link-usado, senha-fraca, senhas-diferentes.' },
  { group: 'G1 · Autenticação', title: 'AUTH-07 · Verificar e-mail', path: 'screens/auth/verificar-email.html', role: 'personal', note: 'Variantes: reenvio-aguardando, link-expirado, verificado, aguardando-responsavel.' },
  { group: 'G1 · Autenticação', title: 'AUTH-08 · Selecionar perfil', path: 'screens/auth/selecionar-perfil.html', role: 'aluno', note: 'Variantes: aluno-dois-personais, personal-e-admin.' },
  { group: 'G1 · Sistema', title: 'SIS-01 · Sessão expirada', path: 'screens/sistema/sessao-expirada.html', role: 'aluno', note: 'Variantes: com-rascunho, sem-rascunho.' },
  { group: 'G1 · Sistema', title: 'SIS-02 · Acesso negado', path: 'screens/sistema/acesso-negado.html', role: 'personal', note: 'Variante: com-outro-perfil.' },
  { group: 'G1 · Sistema', title: 'SIS-03 · Página não encontrada', path: 'screens/sistema/nao-encontrada.html', role: 'aluno' },
  { group: 'G1 · Sistema', title: 'SIS-04 · Manutenção', path: 'screens/sistema/manutencao.html', role: 'aluno', note: 'Variante: sem-previsao.' },
  { group: 'G1 · Sistema', title: 'SIS-05 · Em breve', path: 'screens/sistema/em-breve.html', role: 'personal', note: 'Módulos pela URL: ?modulo=alunos|treinos|prescricao-ia|financeiro|relatorios|agenda.' },
  { group: 'G1 · Legal', title: 'LEG-01 · Termos de uso', path: 'screens/legal/termos.html', role: 'aluno', note: 'Variante: nova-versao.' },
  { group: 'G1 · Legal', title: 'LEG-02 · Política de privacidade', path: 'screens/legal/privacidade.html', role: 'aluno', note: 'Variante: nova-versao.' }
);
