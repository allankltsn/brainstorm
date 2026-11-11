// Marca visual de atalho de demonstração: só aparece junto com elementos que existem em builds VITE_DEMO.
export function DemoBadge() {
  return (
    <span className="ml-2 rounded border px-1.5 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
      demo
    </span>
  )
}
