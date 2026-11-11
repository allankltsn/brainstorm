import { useNavigate } from 'react-router-dom'

const BASE = import.meta.env.BASE_URL
const frame = { display: 'block', width: '100%', height: '100%', border: 0 }

// "/" → aura-landing. Os botões "Começar…" levam para /login (prototype-v2).
export function Landing() {
  const navigate = useNavigate()

  // iframe e host são da mesma origem: observamos os cliques dentro da landing, sem alterá-la.
  const onLoad = (e) => {
    e.currentTarget.contentDocument.addEventListener(
      'click',
      (ev) => {
        const a = ev.target.closest?.('a,button')
        if (!a) return
        const toLogin = a.getAttribute('href') === '#/login' || /^\s*come[cç]ar/i.test(a.textContent)
        if (!toLogin) return
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

// "/brand" → aura-brand (também usa HashRouter). index.html explícito: em desenvolvimento,
// o Vite não resolve a pasta public/brand/ sozinho e devolveria o próprio host.
export function Brand() {
  return <iframe title="aura-brand · protótipo" src={`${BASE}brand/index.html`} style={frame} />
}
