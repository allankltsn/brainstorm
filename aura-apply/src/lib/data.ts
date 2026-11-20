/*
 * Dados do protótipo. Perfil fictício (placeholder) — nenhum dado pessoal real.
 * Nada aqui fala com backend/Stagehand — é só o material para desenhar as telas.
 */

export type Fit = 'alta' | 'media' | 'baixa'
export type WorkMode = 'remote' | 'hybrid' | 'onsite'

export type Job = {
  id: string
  title: string
  company: string
  location: string
  workMode: WorkMode
  salary: string | null
  postedAt: string
  source: string
  /** ATS/portal que hospeda o formulário (define o adaptador no sistema real) */
  ats: string
  url: string
  fit: Fit
  why: string
  description?: string[]
  requirements?: string[]
  companyAbout?: string
}

export const FIT_LABEL: Record<Fit, string> = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }
export const MODE_LABEL: Record<WorkMode, string> = { remote: 'Remoto', hybrid: 'Híbrido', onsite: 'Presencial' }

export const jobs: Job[] = [
  {
    id: 'indeed-225',
    title: 'Desenvolvedor(a) Python Sênior (IA)',
    company: 'Extractta',
    location: 'Remoto',
    workMode: 'remote',
    salary: null,
    postedAt: '2026-10-30',
    source: 'Indeed',
    ats: 'Gupy',
    url: 'https://to.indeed.com/aa2c7w8hpgry',
    fit: 'alta',
    why: 'Python sênior com IA, 100% remoto.',
    companyAbout:
      'Extractta é uma startup de extração de dados e automação documental com IA, atendendo clientes de finanças e logística no Brasil.',
    description: [
      'Procuramos uma pessoa desenvolvedora Python sênior para liderar a construção de pipelines de extração e agentes de IA.',
      'Você vai desenhar serviços na AWS, integrar modelos de linguagem e colocar soluções de RAG em produção com qualidade.',
    ],
    requirements: [
      '8+ anos com Python em produção',
      'Experiência com LangChain/LLMs e bancos vetoriais',
      'AWS (Lambda, ECS, Bedrock) e arquitetura orientada a eventos',
      'Inglês para leitura técnica',
    ],
  },
  {
    id: 'indeed-228',
    title: 'Desenvolvedor Python Sr',
    company: 'MaisTODOS',
    location: 'Remoto',
    workMode: 'remote',
    salary: null,
    postedAt: '2026-11-13',
    source: 'Indeed',
    ats: 'Greenhouse',
    url: 'https://to.indeed.com/aad7rsdsmd46',
    fit: 'alta',
    why: 'Python sênior remoto, publicada esta semana.',
    companyAbout: 'MaisTODOS é uma fintech de benefícios e meios de pagamento com atuação nacional.',
  },
  {
    id: 'indeed-239',
    title: 'Engenheiro(a) de IA – Agentes',
    company: 'Omie',
    location: 'Remoto',
    workMode: 'remote',
    salary: null,
    postedAt: '2026-10-28',
    source: 'Indeed',
    ats: 'Lever',
    url: 'https://to.indeed.com/aaw7mw2vqs6d',
    fit: 'alta',
    why: 'Python, LangChain/LangGraph, Bedrock e RAG: bate com a sua experiência com agentes e AWS.',
    companyAbout: 'Omie é um ERP em nuvem para pequenas e médias empresas, com forte investimento em IA aplicada.',
  },
  {
    id: 'indeed-246',
    title: 'Dev Backend Python (IA e automação de SDLC)',
    company: 'Squadra Technology',
    location: 'Remoto',
    workMode: 'remote',
    salary: null,
    postedAt: '2026-11-16',
    source: 'Indeed',
    ats: 'Gupy',
    url: 'https://to.indeed.com/aaw7xbbpghnz',
    fit: 'media',
    why: 'Agentes de IA e Python, mas a stack pedida é Azure/Semantic Kernel, não AWS.',
  },
  {
    id: 'indeed-244',
    title: 'Engenharia de IA Sênior – Agentes e GenAI (Remoto)',
    company: 'TOTVS',
    location: 'Remoto',
    workMode: 'remote',
    salary: 'A combinar (CLT)',
    postedAt: '2026-11-04',
    source: 'Indeed',
    ats: 'Gupy',
    url: 'https://to.indeed.com/aa2d84k7k6vn',
    fit: 'media',
    why: 'Agentes, RAG e APIs; prefere Azure, aceita Python. CLT.',
  },
  {
    id: 'indeed-230',
    title: 'Backend (Python/Django) Tech Lead – Remoto',
    company: 'Luby',
    location: 'Remoto',
    workMode: 'remote',
    salary: null,
    postedAt: '2026-11-05',
    source: 'Indeed',
    ats: 'Lever',
    url: 'https://to.indeed.com/aa4cjlsvqtjl',
    fit: 'media',
    why: 'Liderança técnica em Python; Django é o ponto a conferir.',
  },
  {
    id: 'indeed-231',
    title: 'Desenvolvedor(a) Backend Sênior IA',
    company: 'Contabilizei',
    location: 'Remoto',
    workMode: 'remote',
    salary: null,
    postedAt: '2026-10-27',
    source: 'Indeed',
    ats: 'Gupy',
    url: 'https://to.indeed.com/aawxbjydhz6h',
    fit: 'media',
    why: 'Backend sênior com IA, remoto.',
  },
  {
    id: 'indeed-240',
    title: 'Engenheiro de IA Sênior',
    company: 'Somos BHS',
    location: 'Remoto',
    workMode: 'remote',
    salary: null,
    postedAt: '2026-11-13',
    source: 'Indeed',
    ats: 'Greenhouse',
    url: 'https://to.indeed.com/aanwxzfybkn8',
    fit: 'media',
    why: 'Engenharia de IA sênior, publicada esta semana.',
  },
  {
    id: 'indeed-236',
    title: 'Analista de IA (Desenvolvedor) – Brasília, presencial',
    company: 'Liberty Comércio e Serviços',
    location: 'Brasília, DF',
    workMode: 'onsite',
    salary: null,
    postedAt: '2026-11-03',
    source: 'Indeed',
    ats: 'Indeed',
    url: 'https://to.indeed.com/aazzsrq7jfb9',
    fit: 'media',
    why: 'Em Brasília, presencial e PJ; confirme a faixa salarial.',
  },
  {
    id: 'indeed-245',
    title: 'Desenvolvedor(a) Node.js Sênior | GenAI | Remoto | CLT',
    company: 'Vonbz',
    location: 'Remoto',
    workMode: 'remote',
    salary: null,
    postedAt: '2026-11-13',
    source: 'Indeed',
    ats: 'Lever',
    url: 'https://to.indeed.com/aaj7qrmdfjcq',
    fit: 'baixa',
    why: 'GenAI, mas a stack principal é Node.js.',
  },
]

/** Preenche detalhes genéricos para as vagas sem texto próprio, para o sheet nunca parecer vazio. */
export function jobDetail(job: Job): Required<Pick<Job, 'description' | 'requirements' | 'companyAbout'>> {
  return {
    companyAbout:
      job.companyAbout ?? `${job.company} é uma empresa de tecnologia com vaga ${MODE_LABEL[job.workMode].toLowerCase()}.`,
    description:
      job.description ?? [
        `Vaga de ${job.title} na ${job.company}.`,
        job.why,
        'Descrição completa e detalhes da empresa são carregados da vaga original no sistema real.',
      ],
    requirements:
      job.requirements ?? [
        'Experiência sênior na stack da vaga',
        'Boas práticas de engenharia e testes',
        'Comunicação clara e trabalho em time',
      ],
  }
}

export function getJob(id: string): Job | undefined {
  return jobs.find((j) => j.id === id)
}

/* ---------------------------------------------------------------- Perfil */

export type Profile = {
  fullName: string
  firstName: string
  email: string
  phone: string
  city: string
  state: string
  country: string
  linkedin: string
  currentTitle: string
  yearsExperience: string
  salaryExpectation: string
  availability: string
  summary: string
  english: string
  spanish: string
  answers: { label: string; value: string }[]
}

export const profile: Profile = {
  fullName: 'Alex Martins Silva',
  firstName: 'Alex',
  email: 'alex.silva@exemplo.com',
  phone: '+55 11 98765-4321',
  city: 'Brasília',
  state: 'DF',
  country: 'Brasil',
  linkedin: 'linkedin.com/in/alex-martins-silva',
  currentTitle: 'Desenvolvedor Sênior',
  yearsExperience: '8',
  salaryExpectation: 'R$ 15.000 a R$ 17.000 (bruto mensal)',
  availability: 'Imediata',
  summary:
    'Desenvolvedor sênior com mais de 8 anos em back-ends Python e sistemas cloud native na AWS. Atua com IA aplicada: agentes autônomos, RAG, bancos vetoriais e Amazon Bedrock.',
  english: 'Intermediário (B1)',
  spanish: 'Avançado (B2)',
  answers: [
    { label: 'Pessoa com deficiência (PCD)', value: 'Não' },
    { label: 'Empresa atual', value: 'TechNova' },
    { label: 'Como encontrou a vaga', value: 'Indeed' },
    { label: 'Aceita banco de talentos (12 meses)', value: 'Sim' },
  ],
}

/* ---------------------------------------------- Formulário (o "gêmeo") */

export type FieldStatus = 'ok' | 'warn' | 'error'
export type FieldType = 'text' | 'email' | 'tel' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'file'

export type FormField = {
  id: string
  group: string
  label: string
  type: FieldType
  value: string
  options?: { value: string; label: string }[]
  status: FieldStatus
  /** Por que o campo precisa de atenção (warn/error) */
  note?: string
  required?: boolean
}

const SIM_NAO = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
]

/**
 * Monta o formulário preenchido para uma vaga, do jeito que o worker entregaria:
 * cada campo com valor, tipo, opções e status do read-back (ok/warn/error).
 * Deixamos 1 warn (cidade com autocomplete divergente) e 1 error (upload drag-drop
 * que falhou) para mostrar a tela de revisão nos três estados.
 */
export function buildForm(job: Job): FormField[] {
  return [
    { id: 'nome', group: 'Dados pessoais', label: 'Nome completo', type: 'text', value: profile.fullName, status: 'ok', required: true },
    { id: 'email', group: 'Dados pessoais', label: 'E-mail', type: 'email', value: profile.email, status: 'ok', required: true },
    { id: 'tel', group: 'Dados pessoais', label: 'Telefone', type: 'tel', value: profile.phone, status: 'ok', required: true },
    {
      id: 'cidade',
      group: 'Dados pessoais',
      label: 'Cidade',
      type: 'select',
      value: 'brasilia-go',
      options: [
        { value: 'brasilia-df', label: 'Brasília - DF' },
        { value: 'brasilia-go', label: 'Brasília de Minas - MG' },
        { value: 'brasilia-mg', label: 'Brasilândia - MG' },
      ],
      status: 'warn',
      note: 'O autocomplete escolheu uma cidade parecida. Confirme a correta.',
      required: true,
    },
    {
      id: 'estado',
      group: 'Dados pessoais',
      label: 'Estado',
      type: 'select',
      value: 'df',
      options: [
        { value: 'df', label: 'Distrito Federal' },
        { value: 'go', label: 'Goiás' },
        { value: 'mg', label: 'Minas Gerais' },
        { value: 'sp', label: 'São Paulo' },
      ],
      status: 'ok',
      required: true,
    },
    { id: 'linkedin', group: 'Dados pessoais', label: 'LinkedIn', type: 'text', value: profile.linkedin, status: 'ok' },
    {
      id: 'curriculo',
      group: 'Documentos',
      label: 'Currículo (PDF)',
      type: 'file',
      value: '',
      status: 'error',
      note: 'O site usa arrastar-e-soltar e não há campo de arquivo acessível. Envie você o arquivo ou assuma no navegador.',
      required: true,
    },
    {
      id: 'carta',
      group: 'Documentos',
      label: 'Carta de apresentação',
      type: 'textarea',
      value: `Tenho mais de 8 anos construindo back-ends Python e sistemas na AWS, com foco recente em agentes de IA e RAG — exatamente o escopo desta vaga de ${job.title} na ${job.company}.`,
      status: 'ok',
    },
    {
      id: 'salario',
      group: 'Perguntas da vaga',
      label: 'Pretensão salarial (R$, bruto mensal)',
      type: 'text',
      value: '15000 a 17000',
      status: 'ok',
      required: true,
    },
    {
      id: 'disponibilidade',
      group: 'Perguntas da vaga',
      label: 'Disponibilidade para início',
      type: 'select',
      value: 'imediata',
      options: [
        { value: 'imediata', label: 'Imediata' },
        { value: '15', label: 'Em 15 dias' },
        { value: '30', label: 'Em 30 dias' },
      ],
      status: 'ok',
      required: true,
    },
    {
      id: 'ingles',
      group: 'Perguntas da vaga',
      label: 'Nível de inglês',
      type: 'select',
      value: 'b1',
      options: [
        { value: 'a2', label: 'Básico (A2)' },
        { value: 'b1', label: 'Intermediário (B1)' },
        { value: 'b2', label: 'Avançado (B2)' },
        { value: 'c1', label: 'Fluente (C1)' },
      ],
      status: 'ok',
      required: true,
    },
    {
      id: 'pcd',
      group: 'Perguntas da vaga',
      label: 'Pessoa com deficiência (PCD)?',
      type: 'radio',
      value: 'nao',
      options: SIM_NAO,
      status: 'ok',
      required: true,
    },
    {
      id: 'banco',
      group: 'Perguntas da vaga',
      label: 'Aceito participar do banco de talentos por 12 meses',
      type: 'checkbox',
      value: 'sim',
      status: 'ok',
    },
  ]
}

/* --------------------------------------------------- Candidaturas */

export type AppStatus = 'preenchendo' | 'revisar' | 'enviada' | 'travou'

export const APP_STATUS_LABEL: Record<AppStatus, string> = {
  preenchendo: 'Preenchendo',
  revisar: 'Revisar',
  enviada: 'Enviada',
  travou: 'Travou',
}

export type Application = {
  id: string
  jobId: string
  status: AppStatus
  /** rótulo humano do momento */
  when: string
}

export const applications: Application[] = [
  { id: 'a1', jobId: 'indeed-239', status: 'revisar', when: 'agora' },
  { id: 'a2', jobId: 'indeed-236', status: 'travou', when: 'há 5 min' },
  { id: 'a3', jobId: 'indeed-228', status: 'preenchendo', when: 'há 8 min' },
  { id: 'a4', jobId: 'indeed-231', status: 'enviada', when: 'ontem, 18:40' },
  { id: 'a5', jobId: 'indeed-244', status: 'enviada', when: 'ontem, 11:02' },
]
