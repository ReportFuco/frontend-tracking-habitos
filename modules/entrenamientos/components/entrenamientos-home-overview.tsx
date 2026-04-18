"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEntrenamientos } from "@/modules/entrenamientos/hooks/useEntrenamientos"

export function EntrenamientosHomeOverview() {
  const { entrenamientoActivo } = useEntrenamientos()

  const primaryHref = entrenamientoActivo ? "/app/entrenamientos/activo" : "/app/entrenamientos/registrar"
  const primaryLabel = entrenamientoActivo
    ? "Ir a entrenamiento activo"
    : "Ir a registrar entrenamiento"
  const secondaryLabel = entrenamientoActivo ? "Registrar otro entrenamiento" : "Ver entrenamiento activo"
  const secondaryDescription = entrenamientoActivo
    ? "Ya tienes una sesion abierta, asi que el siguiente paso natural es continuar desde ahi."
    : "Abre tu entrenamiento en gym y deja la sesion marcada como activa para administrar ahi mismo las series."

  return (
    <article className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)]">
      <p className="font-label text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
        Frente 02
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">Registrar entrenamiento</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{secondaryDescription}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={primaryHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-[color:var(--module-entrenamientos)]"
        >
          {primaryLabel}
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href={entrenamientoActivo ? "/app/entrenamientos/registrar" : "/app/entrenamientos/activo"}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          {secondaryLabel}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  )
}
