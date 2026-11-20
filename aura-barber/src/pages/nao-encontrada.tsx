import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/affect/button'

export function NaoEncontrada() {
  const nav = useNavigate()
  return (
    <div className="mx-auto grid max-w-md place-items-center py-24 text-center">
      <p className="text-5xl font-semibold text-muted-foreground">404</p>
      <p className="mt-2 text-foreground">Página não encontrada.</p>
      <Button className="mt-4" onClick={() => nav('/inicio')}>
        Voltar ao início
      </Button>
    </div>
  )
}
