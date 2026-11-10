import { motion } from "motion/react"
import type { ReactNode } from "react"

import { BlurFade } from "@/components/magicui/blur-fade"
import { cn } from "@/lib/utils"

/** Logo aura-fit: anel + ponto (marca) e wordmark em Inter 700. */
export function Logo({ className }: { className?: string }) {
  return (
    <a href="#topo" aria-label="aura-fit, início" className={cn("inline-flex min-h-11 items-center gap-2 text-lg font-bold tracking-tight text-ink", className)}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="14" cy="14" r="11" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
        <motion.circle
          cx="14" cy="14" r="4.5" fill="var(--color-primary)"
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "14px 14px" }}
        />
      </svg>
      <span>aura-fit</span>
    </a>
  )
}

export function Mock({ children = "[MOCK]", className }: { children?: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md border border-warn/30 bg-warn/10 px-1.5 py-0.5 align-middle text-[11px] font-semibold tracking-wide text-warn", className)}>
      {children}
    </span>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent", className)}>
      <span className="h-px w-6 bg-accent/60" aria-hidden="true" />
      {children}
    </p>
  )
}

export function SectionHead({
  eyebrow, title, lead, id, center = false, children,
}: { eyebrow?: string; title: ReactNode; lead?: ReactNode; id?: string; center?: boolean; children?: ReactNode }) {
  return (
    <div className={cn("mb-12 max-w-3xl md:mb-16", center && "mx-auto text-center")}>
      {eyebrow && (
        <BlurFade inView>
          <Eyebrow className={center ? "justify-center" : undefined}>{eyebrow}</Eyebrow>
        </BlurFade>
      )}
      <BlurFade inView delay={0.08}>
        <h2 id={id} className="h2 mt-4">{title}</h2>
      </BlurFade>
      {lead && (
        <BlurFade inView delay={0.16}>
          <p className="mt-5 text-lg leading-relaxed text-muted">{lead}</p>
        </BlurFade>
      )}
      {children}
    </div>
  )
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-5 md:px-10", className)}>{children}</div>
}

type BtnProps = { href: string; children: ReactNode; variant?: "primary" | "ghost" | "light"; className?: string; title?: string }

/** Botão/link com hover fluido (brilho que acompanha + leve elevação). */
export function Btn({ href, children, variant = "primary", className, title }: BtnProps) {
  return (
    <motion.a
      href={href}
      title={title}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-[15px] font-semibold tracking-tight no-underline",
        variant === "primary" && "bg-primary text-white shadow-[0_10px_40px_-10px_rgb(208_32_43/.7)] hover:bg-primary-hover",
        variant === "ghost" && "border border-line-strong bg-white/[0.03] text-ink hover:border-accent/60 hover:bg-white/[0.06]",
        variant === "light" && "bg-ink text-brand hover:bg-white",
        className,
      )}
    >
      {variant === "primary" && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 opacity-0 blur-md transition-all duration-700 ease-out group-hover:left-[110%] group-hover:opacity-100" />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.a>
  )
}
