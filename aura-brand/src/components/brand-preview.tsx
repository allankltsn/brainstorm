import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fontPair, onColor, type BrandKit, type LogoStyle } from '@/lib/brand'
import { initials } from '@/lib/data'
import { cn } from '@/lib/utils'

export const brandName = (kit: BrandKit) => kit.briefing.name.trim() || 'Sua marca'

/* Logo de exemplo, desenhado a partir do nome e da paleta. Em produção, a IA gera as opções. */
export function LogoMark({ kit, style = kit.logo.style, className }: { kit: BrandKit; style?: LogoStyle; className?: string }) {
  const { palette } = kit
  const name = brandName(kit)
  const font = fontPair(kit.fontId).heading
  if (kit.logo.upload && style === kit.logo.style) return <img src={kit.logo.upload} alt={`Logo de ${name}`} className={cn('object-contain', className)} />
  const label = `Logo de ${name}, estilo ${style}`
  if (style === 'palavra')
    return (
      <svg viewBox="0 0 200 80" role="img" aria-label={label} className={className}>
        <text x="100" y="46" textAnchor="middle" fontFamily={font} fontSize={name.length > 12 ? 20 : 26} fontWeight="700" letterSpacing="-0.5" fill={palette.primary}>
          {name}
        </text>
        <rect x="80" y="58" width="40" height="4" rx="2" fill={palette.accent} />
      </svg>
    )
  if (style === 'selo')
    return (
      <svg viewBox="0 0 200 80" role="img" aria-label={label} className={className}>
        <circle cx="100" cy="40" r="34" fill="none" stroke={palette.primary} strokeWidth="3" />
        <circle cx="100" cy="40" r="27" fill={palette.secondary} />
        <text x="100" y="48" textAnchor="middle" fontFamily={font} fontSize="22" fontWeight="700" fill={palette.primary}>
          {initials(name)}
        </text>
      </svg>
    )
  return (
    <svg viewBox="0 0 200 80" role="img" aria-label={label} className={className}>
      <rect x="68" y="8" width="64" height="64" rx="16" fill={palette.primary} />
      <text x="100" y="50" textAnchor="middle" fontFamily={font} fontSize="28" fontWeight="700" fill={onColor(palette.primary)}>
        {initials(name)}
      </text>
      <circle cx="124" cy="18" r="6" fill={palette.accent} />
    </svg>
  )
}


export type PreviewSlide = { title: string; text?: string }

/*
 * Como a marca fica num post: junta logo, cores, fontes e tom de voz.
 * Com `slides`, vira carrossel: mostra uma tela por vez e os botões trocam de tela.
 */
export function PostPreview({
  kit,
  headline,
  caption,
  hashtags,
  slides,
  slide = 0,
  onSlide,
  className,
}: {
  kit: BrandKit
  headline?: string
  caption?: string
  hashtags?: string[]
  slides?: PreviewSlide[]
  slide?: number
  onSlide?: (i: number) => void
  className?: string
}) {
  const { palette } = kit
  const font = fontPair(kit.fontId)
  const name = brandName(kit)
  const on = onColor(palette.primary)
  const current = slides?.[slide]
  const title = current?.title ?? headline ?? (kit.briefing.offer.trim() || 'O título do seu próximo post aparece aqui')
  const text = caption ?? (kit.voice.sample || 'A legenda segue o tom de voz que você aprovar.')
  return (
    <figure className={cn('overflow-hidden rounded-xl border', className)} style={{ background: palette.surface, color: palette.ink }}>
      <div className="flex items-center gap-2.5 px-4 py-3" style={{ fontFamily: font.body }}>
        <span className="flex size-9 items-center justify-center rounded-full text-xs font-semibold" style={{ background: palette.primary, color: on }}>
          {initials(name)}
        </span>
        <span className="text-sm font-semibold">{name}</span>
      </div>
      <div className="relative flex aspect-[4/3] flex-col justify-end p-5" style={{ background: palette.primary, color: on }}>
        <span className="mb-2 h-1 w-10 rounded-full" style={{ background: palette.accent }} />
        <p className="text-2xl leading-tight font-bold text-balance" style={{ fontFamily: font.heading }}>
          {title}
        </p>
        {current?.text && (
          <p className="mt-2 text-sm leading-relaxed" style={{ fontFamily: font.body }}>
            {current.text}
          </p>
        )}
        {slides && slides.length > 1 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full px-1 py-1 text-xs font-medium" style={{ background: palette.surface, color: palette.ink }}>
            <button
              type="button"
              aria-label="Tela anterior"
              disabled={slide === 0}
              onClick={() => onSlide?.(slide - 1)}
              className="flex size-7 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-current disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="tabular-nums" aria-live="polite">
              {slide + 1} de {slides.length}
            </span>
            <button
              type="button"
              aria-label="Próxima tela"
              disabled={slide === slides.length - 1}
              onClick={() => onSlide?.(slide + 1)}
              className="flex size-7 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-current disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
      <figcaption className="px-4 py-3 text-sm leading-relaxed whitespace-pre-line" style={{ fontFamily: font.body }}>
        {text}
        {hashtags && hashtags.length > 0 && (
          <span className="mt-2 block" style={{ color: palette.primary }}>
            {hashtags.join(' ')}
          </span>
        )}
      </figcaption>
    </figure>
  )
}
