import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

describe("Accordion", () => {
  it("renders the trigger and marks the data-slots", () => {
    const { container } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Pergunta</AccordionTrigger>
          <AccordionContent>Resposta</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    expect(screen.getByText("Pergunta")).toBeInTheDocument()
    expect(container.querySelector('[data-slot="accordion"]')).not.toBeNull()
    expect(
      container.querySelector('[data-slot="accordion-trigger"]')
    ).not.toBeNull()
  })
})
