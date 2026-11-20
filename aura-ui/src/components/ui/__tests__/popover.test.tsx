import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

describe("Popover", () => {
  it("renders portaled content when open by default", () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Abrir</PopoverTrigger>
        <PopoverContent>Conteúdo</PopoverContent>
      </Popover>
    )

    const content = screen.getByText("Conteúdo")
    expect(content).toBeInTheDocument()
    expect(content.closest("[data-slot='popover-content']")).not.toBeNull()
  })

  it("renders the trigger", () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Abrir</PopoverTrigger>
        <PopoverContent>Conteúdo</PopoverContent>
      </Popover>
    )

    expect(screen.getByText("Abrir")).toBeInTheDocument()
  })
})
