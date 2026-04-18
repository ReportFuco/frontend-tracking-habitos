"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuthShellProps {
  eyebrow: string
  title: string
  description: string
  accent?: "olive" | "brick"
  secondaryCta?: {
    href: string
    label: string
    description?: string
  }
  children: ReactNode
}

const accentStyles = {
  olive: {
    wash: "from-primary/14 via-primary/8 to-transparent",
    chip: "bg-primary/10 text-primary",
    orb: "bg-primary/12",
  },
  brick: {
    wash: "from-tertiary/14 via-tertiary/8 to-transparent",
    chip: "bg-tertiary/10 text-tertiary",
    orb: "bg-tertiary/12",
  },
}

export function AuthShell({
  eyebrow,
  title,
  description,
  accent = "olive",
  secondaryCta,
  children,
}: AuthShellProps) {
  const tone = accentStyles[accent]

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(66,81,47,0.12),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(132,49,31,0.08),transparent_28%)]" />
      <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute bottom-[-7rem] right-[-3rem] h-64 w-64 rounded-full bg-tertiary/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-stretch gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[2rem] bg-[color:var(--surface-low)] px-6 py-8 shadow-[var(--shadow-airy)] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className={cn("absolute inset-0 bg-gradient-to-br", tone.wash)} />
          <div className="absolute right-[-2rem] top-[-1rem] h-44 w-44 rounded-full border border-white/20 bg-white/20 blur-2xl" />
          <div className={cn("absolute bottom-10 right-10 h-20 w-20 rounded-full blur-2xl", tone.orb)} />

          <div className="relative flex items-start justify-between gap-4">
            <div className={cn("inline-flex rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]", tone.chip)}>
              {eyebrow}
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-xs font-medium text-foreground/80 backdrop-blur-sm transition hover:bg-white"
            >
              <ArrowLeft className="size-3.5" />
              Inicio
            </Link>
          </div>

          <div className="relative max-w-xl space-y-5 pt-10 lg:pt-20">
            <p className="font-label text-xs uppercase tracking-[0.3em] text-muted-foreground">
              The Curated Life
            </p>
            <h1 className="max-w-lg text-4xl leading-none font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </p>
          </div>

          <div className="relative grid gap-4 pt-10 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white/72 p-5 backdrop-blur-sm">
              <p className="font-label text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                Experiencia
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground/80">
                Una entrada más calmada y editorial, con foco en claridad, tono cálido y menos fricción.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white/56 p-5 backdrop-blur-sm">
              <p className="font-label text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                Estado actual
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground/80">
                Auth ya funciona con JWT y redirección protegida al panel. Esta capa ahora acompaña mejor ese flujo.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-xl rounded-[2rem] bg-[color:var(--surface-lowest)] p-5 shadow-[var(--shadow-airy-lg)] sm:p-6 lg:p-8">
            {children}

            {secondaryCta ? (
              <div className="mt-8 flex items-center justify-between rounded-[1.5rem] bg-[color:var(--surface-low)] px-4 py-4">
                <p className="text-sm text-muted-foreground">
                  {secondaryCta.description ?? "Continuar con otra opcion de acceso"}
                </p>
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-primary"
                >
                  {secondaryCta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}
