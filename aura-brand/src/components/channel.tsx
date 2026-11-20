import { Camera, Globe, Mail, MessageCircle, Music2, ThumbsUp } from 'lucide-react'
import { MSG_CHANNELS, type MsgChannel } from '@/lib/crm'
import { cn } from '@/lib/utils'

/*
 * Selo do canal. O kit de ícones não traz logotipos de redes, então cada canal tem um ícone
 * genérico e uma cor; o nome do canal vai sempre junto (texto ou aria-label), nunca só a cor.
 */
const STYLE: Record<MsgChannel, { icon: React.ReactNode; cls: string }> = {
  whatsapp: { icon: <MessageCircle />, cls: 'bg-success-soft text-success' },
  instagram: { icon: <Camera />, cls: 'bg-brand-soft text-brand-text' },
  facebook: { icon: <ThumbsUp />, cls: 'bg-info-soft text-info' },
  email: { icon: <Mail />, cls: 'bg-muted text-muted-foreground' },
  site: { icon: <Globe />, cls: 'bg-warning-soft text-warning' },
  tiktok: { icon: <Music2 />, cls: 'bg-foreground text-background' },
  x: { icon: <span className="text-[0.7em] leading-none font-bold">X</span>, cls: 'bg-foreground text-background' },
}

export function ChannelIcon({ channel, className }: { channel: MsgChannel; className?: string }) {
  const s = STYLE[channel]
  return (
    <span role="img" aria-label={MSG_CHANNELS[channel]} className={cn('inline-flex size-5 shrink-0 items-center justify-center rounded-full [&_svg]:size-3', s.cls, className)}>
      {s.icon}
    </span>
  )
}

export function ChannelPill({ channel, prefix }: { channel: MsgChannel; prefix?: string }) {
  const s = STYLE[channel]
  return (
    <span className={cn('inline-flex h-6 items-center gap-1 rounded-full px-2 text-xs font-medium whitespace-nowrap [&_svg]:size-3.5', s.cls)}>
      {s.icon}
      {prefix}
      {MSG_CHANNELS[channel]}
    </span>
  )
}
