import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/affect/button'

export function NaoEncontrada() {
  const navigate = useNavigate()
  return (
    <div className="grid min-h-dvh place-items-center bg-background p-6 text-center">
      <div>
        <p className="text-5xl font-semibold text-muted-foreground/40">404</p>
        <h1 className="mt-2 text-lg font-semibold">Página não encontrada</h1>
        <p className="mt-1 text-sm text-muted-foreground">O endereço não existe ou a candidatura já foi fechada.</p>
        <Button className="mt-5" onClick={() => navigate('/vagas')}>
          Ir para as vagas
        </Button>
      </div>
    </div>
  )
}
