"use client"

import { ShieldCheck, UserCheck, UserX } from "lucide-react"
import type { Usuario } from "@/modules/usuario/types/usuario"

interface PerfilSummaryCardProps {
  perfil: Usuario | null
  loading: boolean
}

const formatDate = (value: string) => {
  try {
    return new Date(value).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return value
  }
}

export function PerfilSummaryCard({ perfil, loading }: PerfilSummaryCardProps) {
  if (loading && !perfil) {
    return (
      <section className="surface-section flex min-h-40 items-center">
        <p className="text-sm text-muted-foreground">Cargando tu perfil...</p>
      </section>
    )
  }

  if (!perfil) {
    return (
      <section className="surface-section flex min-h-40 items-center">
        <p className="text-sm text-muted-foreground">
          No pudimos cargar tu perfil. Intenta recargar la pagina.
        </p>
      </section>
    )
  }

  const initials =
    `${perfil.nombre?.[0] ?? ""}${perfil.apellido?.[0] ?? ""}`.toUpperCase() || "?"

  return (
    <section className="surface-section flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-4">
        <span
          className="flex size-16 items-center justify-center rounded-xl bg-[color:var(--primary)] font-[family-name:var(--font-label)] text-lg font-medium text-[color:var(--primary-foreground)]"
          aria-hidden
        >
          {initials}
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-[family-name:var(--font-label)] text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
            @{perfil.username}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            {perfil.nombre} {perfil.apellido}
          </h2>
          <p className="text-sm text-muted-foreground">
            {perfil.email}
            {perfil.telefono ? ` — ${perfil.telefono}` : null}
          </p>
          <p className="font-[family-name:var(--font-label)] text-[0.7rem] uppercase tracking-wider text-muted-foreground">
            Miembro desde {formatDate(perfil.created_at)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:items-end">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-[family-name:var(--font-label)] text-[0.7rem] uppercase tracking-wider ${
            perfil.is_active
              ? "bg-[color:var(--tertiary-container)] text-[color:var(--tertiary)]"
              : "bg-[color:var(--surface-lowest)] text-muted-foreground"
          }`}
        >
          {perfil.is_active ? (
            <>
              <UserCheck className="size-3" /> Activo
            </>
          ) : (
            <>
              <UserX className="size-3" /> Inactivo
            </>
          )}
        </span>
        {perfil.is_superuser ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--tertiary-container)] px-3 py-1 font-[family-name:var(--font-label)] text-[0.7rem] uppercase tracking-wider text-[color:var(--tertiary)]">
            <ShieldCheck className="size-3" /> Superusuario
          </span>
        ) : null}
      </div>
    </section>
  )
}
