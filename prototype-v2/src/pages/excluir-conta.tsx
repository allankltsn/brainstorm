import { ArrowLeft, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Section } from '@/components/page'
import { deleteEffects } from '@/lib/extras'
import { useRole } from '@/lib/role'

const WORD = 'EXCLUIR'

export function ExcluirConta() {
  const navigate = useNavigate()
  const { role } = useRole()
  const [pwd, setPwd] = useState('')
  const [word, setWord] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  return (
    <div className="mx-auto max-w-xl">
      <Link to="/configuracoes?aba=privacidade" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Configurações
      </Link>
      <PageHeader title="Excluir conta" description="A exclusão acontece em 7 dias. Até lá, basta entrar de novo para desistir." />
      <div role="alert" className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        <p className="flex items-center gap-2 font-medium">
          <TriangleAlert className="size-4" /> Depois dos 7 dias não dá para desfazer
        </p>
        <ul className="mt-2 grid list-disc gap-1 pl-6">
          {deleteEffects[role].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <Section title="Confirme que é você">
        <div className="grid gap-5">
          <TextField label="Sua senha" type="password" autoComplete="current-password" value={pwd} onChange={(e) => setPwd(e.target.value)} error={error} />
          <TextField label={`Digite ${WORD} para confirmar`} autoComplete="off" value={word} onChange={(e) => setWord(e.target.value)} />
        </div>
      </Section>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Button variant="secondary" onClick={() => navigate('/configuracoes?aba=privacidade')}>
          Manter minha conta
        </Button>
        <Button
          variant="destructive"
          loading={loading}
          disabled={word.trim().toUpperCase() !== WORD}
          onClick={() => {
            if (!pwd) return setError('Digite sua senha.')
            setLoading(true)
            setTimeout(() => {
              toast.success('Exclusão agendada para daqui a 7 dias')
              navigate('/login')
            }, 900)
          }}
        >
          {loading ? 'Agendando' : 'Excluir minha conta'}
        </Button>
      </div>
    </div>
  )
}
