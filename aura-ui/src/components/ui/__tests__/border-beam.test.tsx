import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { BorderBeam } from "@/components/ui/border-beam"

describe("BorderBeam", () => {
  it("mounts without throwing", () => {
    const { container } = render(
      <div className="relative">
        <BorderBeam />
      </div>
    )

    expect(container.firstChild).toBeTruthy()
  })
})
