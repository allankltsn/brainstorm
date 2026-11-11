import { BellRing, Hourglass } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { comingSoon } from '@/lib/extras'

export function EmBreve() {
  const { modulo } = useParams()
  const m = comingSoon[modulo ?? ''] ?? { title: 'Esta área', text: 'Estamos preparando esta parte do aura-fit.' }
  const [asked, setAsked] = useState(false)
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-info-soft text-info">
        <Hourglass className="size-7" />
      </span>
      <h1 className="text-xl font-semibold tracking-tight">{m.title} chega em breve</h1>
      <p className="max-w-md text-sm text-muted-foreground">{m.text}</p>
      <Button
        className="mt-2"
        variant="secondary"
        icon={<BellRing />}
        disabled={asked}
        onClick={() => {
          setAsked(true)
          toast.success('Combinado. Avisamos você por e-mail.')
        }}
      >
        {asked ? 'Você será avisado' : 'Avisar quando chegar'}
      </Button>
    </div>
  )
}
