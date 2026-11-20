import { describe, it, expect, beforeAll } from "vitest"
import { render, screen } from "@testing-library/react"
import { DatePicker } from "@/components/ui/date-picker"

beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList
  }
})

describe("DatePicker", () => {
  it("renders the trigger with the default placeholder", () => {
    render(<DatePicker />)

    const trigger = screen.getByText("Escolha uma data")
    expect(trigger).toBeInTheDocument()
    expect(trigger.closest("[data-slot='date-picker']")).not.toBeNull()
  })
})
