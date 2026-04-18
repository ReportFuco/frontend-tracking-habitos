"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function FormPanel({
  eyebrow,
  title,
  description,
  aside,
  children,
  accent = "primary",
}: {
  eyebrow: string
  title: string
  description: string
  aside?: ReactNode
  children: ReactNode
  accent?: "primary" | "tertiary"
}) {
  const accentClass =
    accent === "tertiary"
      ? "from-tertiary/12 via-tertiary/6 to-transparent"
      : "from-primary/12 via-primary/6 to-transparent"

  return (
    <section className="overflow-hidden rounded-[1.75rem] bg-[color:var(--surface-lowest)] shadow-[var(--shadow-airy-lg)]">
      <div className={cn("bg-gradient-to-br px-6 py-6 sm:px-8", accentClass)}>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-3">
            <p className="font-label text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground">
              {eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground">{title}</h2>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
          {aside ? (
            <div className="rounded-[1.5rem] bg-white/70 p-5 backdrop-blur-sm">{aside}</div>
          ) : null}
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-8">{children}</div>
    </section>
  )
}

export function FieldGroup({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <label className="font-label text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
          {label}
        </label>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
    </div>
  )
}

export function EditorialSelect({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-13 w-full rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 text-sm text-foreground shadow-none outline-none transition focus:border-b-2 focus:border-primary",
        className
      )}
      {...props}
    />
  )
}

export function FormNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1.5rem] bg-[color:var(--surface-low)] p-4">
      <p className="text-sm leading-6 text-muted-foreground">{children}</p>
    </div>
  )
}
