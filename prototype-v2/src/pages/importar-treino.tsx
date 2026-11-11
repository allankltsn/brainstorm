import { ArrowLeft, CheckCircle2, FileSpreadsheet, TriangleAlert, Upload } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { Checkbox } from '@/components/affect/checkbox'
import { PageHeader, Pill } from '@/components/page'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { importPreview } from '@/lib/tracking'

type Step = 'arquivo' | 'lendo' | 'revisao'

export function ImportarTreino() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('arquivo')
  const [agree, setAgree] = useState(false)
  const [agreeError, setAgreeError] = useState<string>()
  const pending = importPreview.filter((r) => !r.ok).length

  function read() {
    if (!agree) return setAgreeError('Confirme que a planilha não tem dados pessoais de alunos.')
    setAgreeError(undefined)
    setStep('lendo')
    setTimeout(() => setStep('revisao'), 1400)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/treinos?aba=importar" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Treinos
      </Link>
      <PageHeader title="Importar planilha" description="A IA organiza os exercícios. Você confere tudo antes de salvar." />
      {step === 'arquivo' && (
        <div className="rounded-xl border border-dashed p-6 sm:p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <FileSpreadsheet className="size-9 text-muted-foreground" />
            <p className="font-medium">treinos-outubro.xlsx</p>
            <p className="text-sm text-muted-foreground">Arquivo de exemplo, 5 linhas. Aceitamos Excel e CSV de até 5 MB.</p>
          </div>
          <div className="mx-auto mt-6 max-w-md">
            <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} error={agreeError} label="A planilha não tem nome, contato ou dados de saúde de alunos." description="O conteúdo é lido pela IA para reconhecer os exercícios." />
            <Button className="mt-5 w-full" icon={<Upload />} onClick={read}>
              Ler planilha
            </Button>
          </div>
        </div>
      )}
      {step === 'lendo' && (
        <div className="grid gap-3" role="status" aria-label="Lendo a planilha">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      )}
      {step === 'revisao' && (
        <>
          {pending > 0 && (
            <div role="alert" className="mb-4 flex gap-3 rounded-xl border border-warning/40 bg-warning-soft p-4 text-sm text-warning">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <p>{pending} linha não foi reconhecida. Ela fica de fora, e você pode adicionar o exercício depois no editor.</p>
            </div>
          )}
          <div className="overflow-hidden rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Na planilha</TableHead>
                  <TableHead>Exercício reconhecido</TableHead>
                  <TableHead className="hidden sm:table-cell">Séries × repetições</TableHead>
                  <TableHead className="pr-5">Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importPreview.map((r) => (
                  <TableRow key={r.row}>
                    <TableCell className="py-3 pl-5 text-sm text-muted-foreground">{r.text}</TableCell>
                    <TableCell className="text-sm font-medium whitespace-normal">{r.match ?? 'Não reconhecido'}</TableCell>
                    <TableCell className="hidden text-sm tabular-nums sm:table-cell">{r.ok ? `${r.sets} × ${r.reps}` : '—'}</TableCell>
                    <TableCell className="pr-5">
                      {r.ok ? <Pill tone="success" icon={<CheckCircle2 />}>Certo</Pill> : <Pill tone="warning" icon={<TriangleAlert />}>Revisar</Pill>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={() => setStep('arquivo')}>
              Trocar arquivo
            </Button>
            <Button
              onClick={() => {
                toast.success('Treino importado como rascunho', { description: `${importPreview.length - pending} exercícios adicionados.` })
                navigate('/treinos/novo')
              }}
            >
              Criar treino com {importPreview.length - pending} exercícios
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
