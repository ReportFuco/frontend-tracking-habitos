"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Trash2, UserX } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card className="border-[color:var(--destructive)]/25">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[color:var(--destructive)]">
          <AlertTriangle className="size-4" />
          Zona sensible
        </CardTitle>
        <CardDescription>
          Acciones que afectan el estado de tu cuenta. Revisalas con cuidado antes de continuar.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-lg bg-[color:var(--surface-lowest)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-[color:var(--destructive)]">
              <UserX className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Desactivar cuenta</p>
              <p className="text-xs text-muted-foreground">
                Conserva tus datos pero bloquea el acceso. Puedes pedir reactivacion al soporte.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="sm:w-auto"
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
              <p className="text-xs text-muted-foreground">
                Borra tus datos del sistema. Esta accion no se puede deshacer.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="destructive"
            className="sm:w-auto"
            onClick={() => setMode("eliminar")}
            disabled={submitting}
          >
            Eliminar
          </Button>
        </div>
      </CardContent>

      <Dialog open={mode !== null} onOpenChange={(open) => (open ? null : setMode(null))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isDesactivar ? "Desactivar tu cuenta" : "Eliminar tu cuenta"}
            </DialogTitle>
            <DialogDescription>
              {isDesactivar
                ? "Vas a cerrar el acceso a tu cuenta. Podras volver a activarla contactando al soporte."
                : "Esta accion es permanente: todos tus datos seran borrados y no podran recuperarse."}
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Usuario: <span className="font-medium text-foreground">@{perfil.username}</span>
          </p>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={submitting}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant={isDesactivar ? "outline" : "destructive"}
              onClick={isDesactivar ? handleDesactivar : handleEliminar}
              disabled={submitting}
            >
              {submitting ? "Procesando..." : isDesactivar ? "Si, desactivar" : "Si, eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
