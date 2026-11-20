import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NaoEncontrada() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-6xl font-semibold text-primary">404</p>
      <h1 className="text-xl font-semibold">Esta página saiu de órbita</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        O endereço que você abriu não existe no Aura Echo. Vamos te levar de volta.
      </p>
      <Button asChild>
        <Link to="/">Voltar ao início</Link>
      </Button>
    </div>
  )
}
