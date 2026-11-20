import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"

type Row = { name: string; qty: number }

const columns: ColumnDef<Row>[] = [
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "qty", header: "Qtd" },
]

const data: Row[] = [
  { name: "Arroz", qty: 5 },
  { name: "Feijão", qty: 3 },
  { name: "Macarrão", qty: 8 },
]

describe("DataTable", () => {
  it("renderiza os cabeçalhos das colunas e um valor de célula", () => {
    render(<DataTable columns={columns} data={data} />)

    expect(screen.getByText("Nome")).toBeInTheDocument()
    expect(screen.getByText("Qtd")).toBeInTheDocument()
    expect(screen.getByText("Arroz")).toBeInTheDocument()
  })

  it("filtra as linhas pela coluna de busca", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Buscar nome"
      />
    )

    expect(screen.getByText("Arroz")).toBeInTheDocument()
    expect(screen.getByText("Feijão")).toBeInTheDocument()

    const input = screen.getByPlaceholderText("Buscar nome")
    fireEvent.change(input, { target: { value: "Arroz" } })

    expect(screen.getByText("Arroz")).toBeInTheDocument()
    expect(screen.queryByText("Feijão")).not.toBeInTheDocument()
  })
})
