import { useCallback, useEffect, useRef } from 'react'

// Agenda timeouts que são cancelados quando o componente sai da tela (sem navegação fantasma depois do atraso).
export function useTimers() {
  const ids = useRef(new Set<ReturnType<typeof setTimeout>>())
  useEffect(() => {
    const set = ids.current
    return () => {
      set.forEach(clearTimeout)
      set.clear()
    }
  }, [])
  return useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      ids.current.delete(id)
      fn()
    }, ms)
    ids.current.add(id)
  }, [])
}
