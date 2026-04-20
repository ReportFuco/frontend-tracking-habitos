"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Trash2, UserX } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { clearStoredSession } from "@/lib/auth-session"
import { AuthAPI } from "@/modules/auth/api/auth.api"
import type { Usuario } from "@/modules/usuario/types/usuario"

interface PerfilDangerZoneProps {
  perfil: Usuario
  submitting: boolean
  onDesactivar: (idUsuario: number) => Promise<{ ok: boolean; message?: string }>
  onEliminar: (idUsuario: number) => Promise<{ ok: boolean; message?: string }>
}

type DialogMode = null | "desactivar" | "eliminar"

const forceLogoutAndRedirect = async (router: ReturnType<typeof useRouter>) => {
  try {
    await AuthAPI.logout()
  } catch {
    // backend puede haber cerrado la sesion igualmente
  }
  clearStoredSession()
  router.replace("/login")
}

export function PerfilDangerZone({
  perfil,
  submitting,
  onDesactivar,
  onEliminar,
}: PerfilDangerZoneProps) {
  const router = useRouter()
  const [mode, setMode] = useState<DialogMode>(null)

  const handleDesactivar = async () => {
    const result = await onDesactivar(perfil.id_usuario)
    if (!result.ok) {
      toast.error("No pudimos desactivar la cuenta", { description: result.message })
      return
    }
    toast.success("Cuenta desactivada")
    setMode(null)
    await forceLogoutAndRedirect(router)
  }

  const handleEliminar = async () => {
    const result = await onEliminar(perfil.id_usuario)
    if (!result.ok) {
      toast.error("No pudimos eliminar la cuenta", { description: result.message })
      return
    }
    toast.success("Cuenta eliminada")
    setMode(null)
    await forceLogoutAndRedirect(router)
  }

  const isDesactivar = mode === "desactivar"

  return (
    <section className="rounded-[1.5rem] bg-[color:var(--surface-low)] p-4 shadow-[var(--shadow-airy)] sm:rounded-[1.75rem] sm:p-5">
      <div className="rounded-[1.4rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)] sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-label text-[0.65rem] uppercase tracking-[0.22em] text-[color:var(--destructive)]">
              Zona sensible
            </p>
            <h2 className="mt-3 flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
              <AlertTriangle className="size-5 text-[color:var(--destructive)]" />
              Acciones irreversibles o de alto impacto
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Estas decisiones cambian el estado de tu cuenta o eliminan tus datos. Conviene revisarlas con calma antes de continuar.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-lg bg-[color:var(--surface-lowest)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-[color:var(--destructive)]">
              <UserX className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Desactivar cuenta</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Conserva tus datos pero bloquea el acceso. Puedes pedir reactivacion al soporte.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-0 bg-[color:var(--surface-low)] px-4 shadow-none hover:bg-[color:var(--surface-variant)] sm:w-auto"
            onClick={() => setMode("desactivar")}
            disabled={submitting || !perfil.is_active}
          >
            {perfil.is_active ? "Desactivar" : "Ya inactiva"}
          </Button>
        </div>

        <div className="flex flex-col gap-3 rounded-lg bg-[color:var(--surface-lowest)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-[color:var(--destructive)]">
              <Trash2 className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Eliminar cuenta permanentemente</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Borra tus datos del sistema. Esta accion no se puede deshacer.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="destructive"
            className="h-11 rounded-xl px-4 sm:w-auto"
            onClick={() => setMode("eliminar")}
            disabled={submitting}
          >
            Eliminar
          </Button>
        </div>
        </div>
      </div>

      <Dialog open={mode !== null} onOpenChange={(open) => (open ? null : setMode(null))}>
        <DialogContent className="rounded-[1.5rem] border-0 bg-[color:var(--surface-lowest)] p-7 shadow-[var(--shadow-airy-lg)] sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl tracking-tight">
              {isDesactivar ? "Desactivar tu cuenta" : "Eliminar tu cuenta"}
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              {isDesactivar
                ? "Vas a cerrar el acceso a tu cuenta. Podras volver a activarla contactando al soporte."
                : "Esta accion es permanente: todos tus datos seran borrados y no podran recuperarse."}
            </DialogDescription>
          </DialogHeader>

          <p className="rounded-[1rem] bg-[color:var(--surface-low)] px-4 py-3 text-sm text-muted-foreground">
            Usuario: <span className="font-medium text-foreground">@{perfil.username}</span>
          </p>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="h-11 rounded-xl" disabled={submitting}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant={isDesactivar ? "outline" : "destructive"}
              className={
                isDesactivar
                  ? "h-11 rounded-xl border-0 bg-[color:var(--surface-low)] shadow-none hover:bg-[color:var(--surface-variant)]"
                  : "h-11 rounded-xl"
              }
              onClick={isDesactivar ? handleDesactivar : handleEliminar}
              disabled={submitting}
            >
              {submitting ? "Procesando..." : isDesactivar ? "Si, desactivar" : "Si, eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
