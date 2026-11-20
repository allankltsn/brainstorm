import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DotPattern } from "@/components/ui/dot-pattern"

describe("DotPattern", () => {
  it("mounts without throwing", () => {
    const { container } = render(
      <div className="relative">
        <DotPattern />
      </div>
    )

    expect(container.querySelector("svg") ?? container.firstChild).toBeTruthy()
  })
})
