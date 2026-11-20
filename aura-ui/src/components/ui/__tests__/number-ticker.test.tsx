import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { NumberTicker } from "@/components/ui/number-ticker"

describe("NumberTicker", () => {
  it("mounts without throwing", () => {
    const { container } = render(<NumberTicker value={100} />)
    expect(container.firstChild).toBeTruthy()
  })
})
