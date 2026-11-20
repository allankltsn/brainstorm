import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import { ColorPicker } from "@/components/ui/color-picker"

describe("ColorPicker", () => {
  it("renders the trigger with the initial hex value", () => {
    render(<ColorPicker defaultValue="#1e90ff" />)

    expect(screen.getByText("#1e90ff")).toBeInTheDocument()
  })

  it("selects a preset swatch and calls onValueChange with a hex string", () => {
    const onValueChange = vi.fn()
    render(
      <ColorPicker
        defaultValue="#000000"
        presets={["#ef4444", "#22c55e", "#3b82f6"]}
        onValueChange={onValueChange}
      />
    )

    fireEvent.click(screen.getByRole("button"))

    const swatch = screen.getByLabelText("#22c55e")
    fireEvent.click(swatch)

    expect(onValueChange).toHaveBeenCalledWith("#22c55e")
    expect(onValueChange.mock.calls[0][0]).toMatch(/^#[0-9a-fA-F]{6}$/)
  })
})
