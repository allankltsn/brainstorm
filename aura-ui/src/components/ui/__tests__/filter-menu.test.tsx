import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FilterMenu } from "@/components/ui/filter-menu"

const groups = [
  {
    id: "status",
    label: "Status",
    options: [
      { id: "ativo", label: "Ativo" },
      { id: "inativo", label: "Inativo" },
    ],
  },
]

describe("FilterMenu", () => {
  it("renderiza o trigger com data-slot", () => {
    render(<FilterMenu groups={groups} defaultValue={[]} />)
    expect(screen.getByText("Filtros").closest("[data-slot='filter-menu']")).not.toBeNull()
  })

  it("marca uma opção e chama onValueChange com o id", () => {
    const onValueChange = vi.fn()
    render(
      <FilterMenu
        groups={groups}
        defaultValue={[]}
        onValueChange={onValueChange}
      />,
    )

    // Abre o popover
    fireEvent.click(screen.getByText("Filtros"))

    // Marca a opção "Ativo"
    const option = screen.getByLabelText("Ativo")
    fireEvent.click(option)

    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith(
      expect.arrayContaining(["ativo"]),
    )
  })
})
