import { Play } from 'lucide-react'
import type { Exercise, Group } from '@/lib/training'
import { cn } from '@/lib/utils'

/* Sem fotos no protótipo: uma capa neutra por grupo muscular, com a duração do vídeo. */
const TONE: Record<Group, string> = {
  Peito: 'from-rose-200 to-rose-100 dark:from-rose-950 dark:to-zinc-900',
  Costas: 'from-sky-200 to-sky-100 dark:from-sky-950 dark:to-zinc-900',
  Pernas: 'from-amber-200 to-amber-100 dark:from-amber-950 dark:to-zinc-900',
  Ombros: 'from-violet-200 to-violet-100 dark:from-violet-950 dark:to-zinc-900',
  Braços: 'from-emerald-200 to-emerald-100 dark:from-emerald-950 dark:to-zinc-900',
  Core: 'from-zinc-300 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900',
}

export function ExerciseThumb({ exercise, size = 'card', className }: { exercise: Exercise; size?: 'card' | 'row' | 'hero'; className?: string }) {
  const time = `0:${String(exercise.seconds).padStart(2, '0')}`
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br text-foreground/70',
        TONE[exercise.group],
        size === 'row' ? 'size-12 rounded-lg' : size === 'hero' ? 'aspect-video w-full rounded-xl' : 'aspect-[4/3] w-full rounded-lg',
        className,
      )}
    >
      <span className={cn('flex items-center justify-center rounded-full bg-background/80 shadow-sm', size === 'row' ? 'size-6' : size === 'hero' ? 'size-14' : 'size-9')}>
        <Play className={cn('translate-x-px fill-current', size === 'row' ? 'size-3' : size === 'hero' ? 'size-6' : 'size-4')} />
      </span>
      {size !== 'row' && <span className="absolute right-2 bottom-2 rounded bg-background/80 px-1.5 py-0.5 text-[11px] font-medium tabular-nums">{time}</span>}
    </div>
  )
}
