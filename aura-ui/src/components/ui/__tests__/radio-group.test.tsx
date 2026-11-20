import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { RadioGroup, RadioGroupItem } from "../radio-group"
import { Label } from "../label"

describe("RadioGroup", () => {
  it("renders both radio items", () => {
    render(
      <RadioGroup defaultValue="a">
        <div>
          <RadioGroupItem value="a" id="opt-a" />
          <Label htmlFor="opt-a">Option A</Label>
        </div>
        <div>
          <RadioGroupItem value="b" id="opt-b" />
          <Label htmlFor="opt-b">Option B</Label>
        </div>
      </RadioGroup>
    )

    const radios = screen.getAllByRole("radio")
    expect(radios).toHaveLength(2)
  })

  it("renders the radio-group data-slot", () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="a" id="a" />
        <RadioGroupItem value="b" id="b" />
      </RadioGroup>
    )

    expect(
      container.querySelector('[data-slot="radio-group"]')
    ).toBeInTheDocument()
  })
})
