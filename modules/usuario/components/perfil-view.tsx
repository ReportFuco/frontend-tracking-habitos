"use client"

import { PageHeader } from "@/components/shell/page-header"
import { usePerfil } from "@/modules/usuario/hooks/usePerfil"
import { PerfilDangerZone } from "./perfil-danger-zone"
import { PerfilEditForm } from "./perfil-edit-form"
import { PerfilSummaryCard } from "./perfil-summary-card"

export function PerfilView() {
  const {
    perfil,
    loading,
    submitting,
    error,
    actualizarPerfil,
    desactivarCuenta,
    eliminarCuenta,
  } = usePerfil()

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Cuenta"
        title="Perfil"
        description="Tus datos personales, tu username y las acciones sobre tu cuenta."
      />

      {error ? (
        <div className="rounded-lg bg-[color:var(--destructive)]/10 px-4 py-3 text-sm text-[color:var(--destructive)]">
          {error}
        </div>
      ) : null}

      <PerfilSummaryCard perfil={perfil} loading={loading} />

      {perfil ? (
        <>
          <PerfilEditForm
            perfil={perfil}
            submitting={submitting}
            onSubmit={actualizarPerfil}
          />
          <PerfilDangerZone
            perfil={perfil}
            submitting={submitting}
            onDesactivar={desactivarCuenta}
            onEliminar={eliminarCuenta}
          />
        </>
      ) : null}
    </div>
  )
}
