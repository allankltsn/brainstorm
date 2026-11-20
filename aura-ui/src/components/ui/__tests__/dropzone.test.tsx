import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Dropzone } from "@/components/ui/dropzone"

describe("Dropzone", () => {
  it("renderiza o titulo, subtitulo e o input de arquivo", () => {
    const { container } = render(<Dropzone />)

    expect(screen.getByText("Arraste arquivos aqui")).toBeInTheDocument()
    expect(screen.getByText("ou clique para selecionar")).toBeInTheDocument()
    expect(container.querySelector('input[type=file]')).not.toBeNull()
  })

  it("chama onFilesChange e lista o arquivo selecionado", () => {
    const onFilesChange = vi.fn()
    const { container } = render(<Dropzone onFilesChange={onFilesChange} />)

    const input = container.querySelector('input[type=file]') as HTMLInputElement
    const file = new File(["x"], "foo.txt", { type: "text/plain" })

    fireEvent.change(input, { target: { files: [file] } })

    expect(onFilesChange).toHaveBeenCalledWith(
      expect.arrayContaining([file])
    )
    expect(screen.getByText("foo.txt")).toBeInTheDocument()
  })
})
