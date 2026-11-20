import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Particles } from "../particles"

describe("Particles", () => {
  it("mounts without throwing when the canvas context is unavailable", () => {
    // jsdom's HTMLCanvasElement.getContext returns null, so the component must
    // tolerate a missing 2d context without throwing on mount.
    let container: HTMLElement | undefined
    expect(() => {
      ;({ container } = render(<Particles quantity={10} />))
    }).not.toThrow()

    expect(container?.firstChild).toBeTruthy()
  })
})
