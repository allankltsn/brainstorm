import { useSearchParams } from 'react-router-dom'

/* Aba atual guardada na URL (?aba=...), para dar para voltar e compartilhar o link. */
export function useTab<T extends string>(tabs: readonly T[]): [T, (t: T) => void] {
  const [params, setParams] = useSearchParams()
  const raw = params.get('aba') as T | null
  const tab = raw && tabs.includes(raw) ? raw : tabs[0]
  return [tab, (t) => setParams(t === tabs[0] ? {} : { aba: t }, { replace: true })]
}
