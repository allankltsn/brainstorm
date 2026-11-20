import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { GlowCloud, type GlowCloudMood } from "../glow-cloud"

describe("GlowCloud", () => {
  it("mounts without throwing and renders the mascot svg", () => {
    let container: HTMLElement | undefined
    expect(() => {
      ;({ container } = render(<GlowCloud />))
    }).not.toThrow()

    expect(container?.querySelector('[data-slot="glow-cloud"]')).toBeTruthy()
    expect(container?.querySelector("svg")).toBeTruthy()
  })

  it("mounts for every mood without throwing", () => {
    const moods: GlowCloudMood[] = ["idle", "sleepy", "listening", "thinking", "happy"]
    for (const mood of moods) {
      let container: HTMLElement | undefined
      expect(() => {
        ;({ container } = render(<GlowCloud mood={mood} />))
      }).not.toThrow()
      expect(container?.querySelector('[data-slot="glow-cloud"]')).toBeTruthy()
    }
  })
})
