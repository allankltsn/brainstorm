const SECOES = [
  { nome: 'Tokens', estado: 'Fase 1', nota: 'Cor, tipografia, raio, sombra e movimento — fonte única por tema.' },
  { nome: 'Primitivos', estado: 'Fase 2', nota: 'button, input, dialog, table… consolidados dos apps do Aura.' },
  { nome: 'IA · Charts · Motion', estado: 'Fase 3', nota: 'approval-card, thinking-state, charts e efeitos.' },
  { nome: 'Blocos e telas', estado: 'Fase 4', nota: 'seções de landing, padrões de app e telas de exemplo.' },
]

export default function App() {
  return (
    <main className="wrap">
      <header className="head">
        <span className="mark" aria-hidden="true" />
        <h1>aura-ui</h1>
        <p className="tagline">
          UI kit próprio do Aura — uma fonte de tokens, componentes instaláveis pelo CLI do shadcn
          e documentação. Esta é a base (Fase 0); o conteúdo entra nas próximas fases.
        </p>
        <p className="meta">
          Veja o planejamento em <code>PLANO.md</code> · publicado em <code>/ui</code>
        </p>
      </header>

      <section aria-label="Seções do kit" className="grid">
        {SECOES.map((s) => (
          <article key={s.nome} className="card">
            <div className="card-top">
              <h2>{s.nome}</h2>
              <span className="badge">{s.estado}</span>
            </div>
            <p>{s.nota}</p>
          </article>
        ))}
      </section>

      <footer className="foot">
        aura-ui · versão 0.1.1 · parte do <code>brainstorm</code>
      </footer>
    </main>
  )
}
