import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/affect/button'
import { Checkbox } from '@/components/affect/checkbox'
import { TextField } from '@/components/affect/text-field'
import { AuthLayout } from '@/components/auth-layout'
import { Person } from '@/components/page'
import { passwordRules } from '@/lib/auth'
import { sessions } from '@/lib/data'
import { useRole } from '@/lib/role'

export function AceitarConvite() {
  const navigate = useNavigate()
  const { setRole } = useRole()
  const [pwd, setPwd] = useState('')
  const [adult, setAdult] = useState(false)
  const [health, setHealth] = useState(false)
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<{ pwd?: string; adult?: string; terms?: string }>({})
  const [loading, setLoading] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!passwordRules(pwd).every((r) => r.ok)) next.pwd = 'Use 8 caracteres ou mais, com letra e número.'
    if (!adult) next.adult = 'Se você tem menos de 18 anos, peça a um responsável para aceitar o convite.'
    if (!terms) next.terms = 'Para continuar, aceite os termos de uso.'
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    setTimeout(() => {
      setRole('aluno')
      navigate('/inicio')
    }, 900)
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Você foi convidado</h1>
      <p className="mt-1 text-sm text-muted-foreground">Crie sua senha para começar a treinar com:</p>
      <div className="mt-4 rounded-xl border bg-card p-3.5">
        <Person name={sessions.personal.name} sub={sessions.personal.title} />
      </div>
      <form onSubmit={submit} noValidate className="mt-6 grid gap-5">
        <TextField label="E-mail" type="email" size="lg" readOnly defaultValue={sessions.aluno.email} hint="O convite vale só para este e-mail." />
        <TextField label="Crie uma senha" type="password" size="lg" autoComplete="new-password" hint="8 caracteres ou mais, com letra e número." value={pwd} onChange={(e) => setPwd(e.target.value)} error={errors.pwd} />
        <Checkbox checked={adult} onChange={(e) => setAdult(e.target.checked)} error={errors.adult} label="Tenho 18 anos ou mais." />
        <Checkbox
          checked={health}
          onChange={(e) => setHealth(e.target.checked)}
          label="Liberar meus dados de saúde para o personal."
          description="Opcional. Você pode mudar isso quando quiser, em Configurações."
        />
        <Checkbox checked={terms} onChange={(e) => setTerms(e.target.checked)} error={errors.terms} label={<>Li e aceito os <Link to="/termos" className="underline underline-offset-4">termos de uso</Link> e a <Link to="/privacidade" className="underline underline-offset-4">política de privacidade</Link>.</>} />
        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? 'Criando conta' : 'Aceitar convite'}
        </Button>
      </form>
    </AuthLayout>
  )
}
