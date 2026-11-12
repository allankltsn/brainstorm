import { useNavigate } from 'react-router-dom'

const BASE = import.meta.env.BASE_URL
const frame = { display: 'block', width: '100%', height: '100%', border: 0 }

// "/" → aura-landing. Os elementos com data-aura-login levam para /login (prototype-v2).
export function Landing() {
  const navigate = useNavigate()

  // iframe e host são da mesma origem: observamos os cliques dentro da landing, sem alterá-la.
  const onLoad = (e) => {
    // contentDocument é nulo se o iframe sair da mesma origem ou falhar ao carregar: sem ele, a landing segue sem o atalho.
    let doc = null
    try {
      doc = e.currentTarget.contentDocument
    } catch {
      return
    }
    if (!doc) return
    doc.addEventListener(
      'click',
      (ev) => {
        const a = ev.target.closest?.('a,button')
        if (!a) return
        // Contrato único: data-aura-login (REV-BL-05).
        if (!a.closest('[data-aura-login]')) return
        ev.preventDefault()
        ev.stopImmediatePropagation()
        navigate('/login')
      },
      true,
    )
  }

  return <iframe title="aura-fit · landing" src={`${BASE}aura/`} style={frame} onLoad={onLoad} />
}

// "/login" → prototype-v2 (que usa HashRouter: o resto da navegação acontece dentro dele).
export function Prototype() {
  return <iframe title="aura-fit · protótipo" src={`${BASE}proto/#/login`} style={frame} />
}

// "/brand" → aura-brand, compilado em brand-app/ (também usa HashRouter). index.html explícito: em desenvolvimento,
// o Vite não resolve a pasta public/brand/ sozinho e devolveria o próprio host.
export function Brand() {
  return <iframe title="aura-brand · protótipo" src={`${BASE}brand-app/index.html`} style={frame} />
}
