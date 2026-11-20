import * as React from "react"

import { cn } from "@/lib/utils"

const len = (v: number | string | undefined) =>
  typeof v === "number" ? `${v}px` : v

export type ShimmerSkeletonProps = {
  /** Width – a number is px, a string any CSS length; defaults to 100% */
  width?: number | string
  /** Height – a number is px, a string any CSS length; defaults to 12px */
  height?: number | string
  /** Corner radius; defaults to the kit's rounded-md */
  radius?: number | string
  /** Round shape, e.g. for avatars – uses width for both sides */
  circle?: boolean
  className?: string
  style?: React.CSSProperties
}

export type ShimmerTextProps = {
  children: React.ReactNode
  /** Seconds for one pass of the highlight */
  duration?: number
  className?: string
}

function ShimmerSkeleton({
  width,
  height,
  radius,
  circle,
  className,
  style,
}: ShimmerSkeletonProps) {
  const w = len(width)

  return (
    <span
      data-slot="shimmer-skeleton"
      aria-hidden="true"
      className={cn(
        "block max-w-full animate-pulse bg-muted",
        circle ? "rounded-full" : radius === undefined && "rounded-md",
        className
      )}
      style={{
        flexShrink: circle || typeof width === "number" ? 0 : undefined,
        width: w ?? "100%",
        height: circle ? (w ?? len(height) ?? "12px") : (len(height) ?? "12px"),
        borderRadius: circle ? undefined : len(radius),
        ...style,
      }}
    />
  )
}

function ShimmerText({ children, duration = 2, className }: ShimmerTextProps) {
  return (
    <span
      data-slot="shimmer-text"
      className={cn(
        "inline-block animate-pulse text-muted-foreground",
        className
      )}
      style={{ animationDuration: `${duration}s` }}
    >
      {children}
    </span>
  )
}

export { ShimmerSkeleton, ShimmerText }
