import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { TimePicker } from "@/components/ui/time-picker"

describe("time-picker aura-ui", () => {
  it("renderiza com defaultValue 09:00 mostrando 09 e 00", () => {
    render(<TimePicker />)
    expect(screen.getByText("09")).toBeInTheDocument()
    expect(screen.getByText("00")).toBeInTheDocument()
  })

  it("exibe o value controlado 14:30 nos dois triggers", () => {
    render(<TimePicker value="14:30" onValueChange={vi.fn()} />)
    expect(screen.getByText("14")).toBeInTheDocument()
    expect(screen.getByText("30")).toBeInTheDocument()
  })
})
