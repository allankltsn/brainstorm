import { describe, it, expect, beforeAll } from "vitest"
import { render, screen } from "@testing-library/react"
import { DateRangePicker } from "@/components/ui/date-range-picker"

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

describe("DateRangePicker", () => {
  it("renders the trigger with the default placeholder", () => {
    render(<DateRangePicker />)

    const trigger = screen.getByText("Selecione o período")
    expect(trigger).toBeInTheDocument()
    expect(
      trigger.closest("[data-slot='date-range-picker']")
    ).not.toBeNull()
  })

  it("renders the formatted range when a value is provided", () => {
    render(
      <DateRangePicker
        value={{ from: new Date(2026, 0, 10), to: new Date(2026, 0, 20) }}
      />
    )

    const trigger = screen.getByRole("button")
    expect(trigger.textContent).toContain("10/01/2026")
    expect(trigger.textContent).toContain("20/01/2026")
  })
})
