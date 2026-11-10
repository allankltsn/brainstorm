/* screens.js - lista de telas da galeria (index.html). Registre cada tela com SCREENS.push(...).
   Para evitar conflito entre agentes, cada grupo pode ter o seu arquivo (assets/screens-<grupo>.js) seguindo o mesmo formato.
   Campos: group (nome do grupo), title, path (relativo a prototype/), role (padrao: admin|personal|aluno), note (opcional). */
window.SCREENS = window.SCREENS || [];
window.SCREENS.push(
  { group: 'Fundação', title: 'Demonstração de componentes (admin)', path: 'screens/_smoke/dashboard-demo.html', role: 'admin', note: 'Tela de prova: todos os componentes.' },
  { group: 'Fundação', title: 'Demonstração de componentes (aluno)', path: 'screens/_smoke/dashboard-demo.html', role: 'aluno', note: 'Mesma tela com a barra inferior do aluno.' }
);
