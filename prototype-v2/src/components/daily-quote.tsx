import { Quote } from 'lucide-react'
import { quoteOfDay } from '@/lib/engagement'
import { cn } from '@/lib/utils'

export function DailyQuote({ className }: { className?: string }) {
  return (
    <figure className={cn('flex gap-3 rounded-xl border bg-card p-4', className)}>
      <Quote className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div>
        <figcaption className="text-xs font-medium text-muted-foreground">Frase do dia</figcaption>
        <blockquote className="mt-1 text-sm text-pretty">{quoteOfDay.text}</blockquote>
      </div>
    </figure>
  )
}
