import { describe, it, expect, beforeAll } from "vitest"
import { render, screen } from "@testing-library/react"

import { Combobox } from "@/components/ui/combobox"

beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    })
  }
})

describe("Combobox", () => {
  it("renders the trigger with the placeholder", () => {
    render(
      <Combobox
        options={[
          { value: "a", label: "Opção A" },
          { value: "b", label: "Opção B" },
        ]}
      />
    )

    const trigger = screen.getByRole("combobox")
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveTextContent("Selecione")
  })
})
