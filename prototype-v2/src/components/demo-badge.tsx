// Marca visual de atalho de demonstração: só aparece junto com elementos que existem em builds VITE_DEMO.
export function DemoBadge() {
  return (
    // Texto 12px, sem caixa-alta; text-foreground sobre o fundo: #18181b/#ffffff = 17,7:1 (claro), #f4f4f5/#121214 = 17,0:1 (escuro).
    <span className="ml-2 rounded border px-1.5 py-0.5 align-middle text-xs font-semibold text-foreground">demonstração</span>
  )
}
