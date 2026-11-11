import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export type LoadState = 'carregando' | 'pronto' | 'erro'

/*
 * Simula a busca dos dados enquanto não há API. Para ver os outros estados no protótipo,
 * acrescente ?estado=erro, ?estado=vazio ou ?estado=limite no endereço. "Tentar de novo" sempre dá certo.
 */
export function useLoad(ms = 600) {
  const [params] = useSearchParams()
  const forced = params.get('estado')
  const [state, setState] = useState<LoadState>('carregando')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setState(forced === 'erro' && attempt === 0 ? 'erro' : 'pronto'), ms)
    return () => clearTimeout(t)
  }, [attempt, forced, ms])

  return {
    state,
    empty: forced === 'vazio',
    /* limite do plano ou do saldo atingido, nas telas que têm limite */
    limit: forced === 'limite',
    retry: () => {
      setState('carregando')
      setAttempt((a) => a + 1)
    },
  }
}
