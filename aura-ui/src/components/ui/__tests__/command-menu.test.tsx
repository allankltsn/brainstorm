import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { CommandMenu } from "@/components/ui/command-menu"

describe("command-menu aura-ui", () => {
  it("renderiza itens e heading do grupo", () => {
    render(
      <CommandMenu
        open
        onOpenChange={() => {}}
        groups={[{ heading: "Ações", items: [{ id: "new", label: "Novo arquivo" }] }]}
      />,
    )
    expect(screen.getByText("Novo arquivo")).toBeInTheDocument()
    expect(screen.getByText("Ações")).toBeInTheDocument()
  })

  it("chama onSelect ao clicar no item", () => {
    const onSelect = vi.fn()
    render(
      <CommandMenu
        open
        onOpenChange={() => {}}
        groups={[
          { heading: "Ações", items: [{ id: "new", label: "Novo arquivo", onSelect }] },
        ]}
      />,
    )
    fireEvent.click(screen.getByText("Novo arquivo"))
    expect(onSelect).toHaveBeenCalled()
  })
})
