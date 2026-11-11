// Atalhos e estados de demonstração (conta de teste, link simulado etc.) só existem com VITE_DEMO=true.
// O workflow do GitHub Pages liga a flag porque o site publicado É a demonstração; em qualquer outro build ela fica desligada.
export const DEMO = import.meta.env.VITE_DEMO === 'true'

// Conta de teste fictícia (domínio reservado .example, RFC 2606).
export const DEMO_EMAIL = 'carla.mendes@aura.example'
export const DEMO_PASSWORD = 'aurafit123'
