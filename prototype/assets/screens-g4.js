/* screens-g4.js - galeria do G4 (homes e configuracoes). Mesmo formato de screens.js. */
window.SCREENS = window.SCREENS || [];
window.SCREENS.push(
  { group: 'G4 Homes e configurações', title: 'HOME-01 Início do administrador', path: 'screens/home/admin.html', role: 'admin', note: 'Variante: sem-alertas.' },
  { group: 'G4 Homes e configurações', title: 'HOME-02 Início do personal', path: 'screens/home/personal.html', role: 'personal', note: 'Variantes: primeiro-acesso, inadimplente, limite-proximo.' },
  { group: 'G4 Homes e configurações', title: 'HOME-03 Início do aluno', path: 'screens/home/aluno.html', role: 'aluno', note: 'Variantes: dia-de-descanso, sem-treino-ainda, aguardando-responsavel.' },
  { group: 'G4 Homes e configurações', title: 'HOME-04 Treino do dia (aluno)', path: 'screens/home/aluno-treino-do-dia.html', role: 'aluno', note: 'Variante: dia-de-descanso.' },
  { group: 'G4 Homes e configurações', title: 'PER-01 Convidar aluno', path: 'screens/home/convidar-aluno.html', role: 'personal', note: 'Variantes: limite-atingido, link-copiado, email-ja-convidado.' },
  { group: 'G4 Homes e configurações', title: 'CFG-00 Configurações / Perfil (aluno)', path: 'screens/config/configuracoes.html', role: 'aluno', note: 'No personal e admin é o índice de Configurações.' },
  { group: 'G4 Homes e configurações', title: 'CFG-01 Aparência', path: 'screens/config/aparencia.html', role: 'aluno', note: 'Variantes: escuro-ativo, texto-grande.' },
  { group: 'G4 Homes e configurações', title: 'CFG-02 Meus dados', path: 'screens/config/meus-dados.html', role: 'aluno', note: 'Variantes: email-alteracao-pendente, senha-atual-errada, foto-grande-demais, sessao-expirou-ao-salvar.' },
  { group: 'G4 Homes e configurações', title: 'CFG-03 Notificações', path: 'screens/config/notificacoes.html', role: 'aluno', note: 'Variante: tudo-desligado.' },
  { group: 'G4 Homes e configurações', title: 'CFG-05 Privacidade e meus direitos', path: 'screens/config/privacidade.html', role: 'aluno', note: 'Variantes: exportacao-em-preparo, exportacao-pronta, revogar-confirmar, consentimento-saude-pendente.' },
  { group: 'G4 Homes e configurações', title: 'CFG-06 Excluir conta', path: 'screens/config/excluir-conta.html', role: 'aluno', note: 'Variantes: personal-com-assinatura, personal-com-alunos, agendada, ultimo-admin.' }
);
