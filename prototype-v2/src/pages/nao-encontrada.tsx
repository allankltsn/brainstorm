import { Compass, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/affect/button'

function Notice({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-7">{icon}</span>
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{text}</p>
      <Link to="/inicio" className="mt-2">
        <Button>Voltar para o início</Button>
      </Link>
    </div>
  )
}

export function NaoEncontrada() {
  return <Notice icon={<Compass />} title="Página não encontrada" text="O endereço pode ter mudado ou não existir mais. Volte ao início e tente de novo pelo menu." />
}

export function AcessoNegado() {
  return <Notice icon={<ShieldAlert />} title="Você não tem acesso a esta tela" text="Esta área é de outro perfil. Troque de perfil no menu do usuário ou volte ao início." />
}
