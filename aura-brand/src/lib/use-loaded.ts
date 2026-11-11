import { useEffect, useState } from 'react'

/* Protótipo: simula o tempo de uma busca de dados para exercitar o estado de carregamento. */
export function useLoaded(ms = 600) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setLoaded(true), ms)
    return () => window.clearTimeout(t)
  }, [ms])
  return loaded
}
