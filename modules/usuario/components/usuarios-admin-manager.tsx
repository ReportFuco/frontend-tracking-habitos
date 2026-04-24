"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { FormPanel } from "@/components/forms/editorial-form"
import { UsuariosAPI } from "@/modules/usuario/api/usuario.api"
import type { Usuario } from "@/modules/usuario/types/usuario"

export function UsuariosAdminManager() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<number | null>(null)

  useEffect(() => {
    void UsuariosAPI.getAll()
      .then(setUsuarios)
      .catch(() => toast.error("Error al cargar usuarios"))
      .finally(() => setLoading(false))
  }, [])

  const handleDesactivar = async (idUsuario: number) => {
    setSubmitting(idUsuario)
    try {
      await UsuariosAPI.desactivar(idUsuario)
      setUsuarios((prev) =>
        prev.map((u) => (u.id_usuario === idUsuario ? { ...u, is_active: false } : u))
      )
      toast.success("Usuario desactivado")
    } catch {
      toast.error("No se pudo desactivar el usuario")
    } finally {
      setSubmitting(null)
    }
  }

  const handleEliminar = async (idUsuario: number) => {
    setSubmitting(idUsuario)
    try {
      await UsuariosAPI.eliminarPermanente(idUsuario)
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== idUsuario))
      toast.success("Usuario eliminado permanentemente")
    } catch {
      toast.error("No se pudo eliminar el usuario")
    } finally {
      setSubmitting(null)
    }
  }

  return (
    <FormPanel eyebrow="Sistema">
      <div className="space-y-2">
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay usuarios registrados.</p>
        ) : null}

        {usuarios.map((usuario) => {
          const isSubmitting = submitting === usuario.id_usuario
          return (
            <div key={usuario.id_usuario} className="rounded-4xl bg-surface-low px-4 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">
                      {usuario.nombre} {usuario.apellido}
                    </p>
                    {usuario.is_superuser ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        Admin
                      </span>
                    ) : null}
                    {!usuario.is_active ? (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                        Inactivo
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">{usuario.email}</p>
                  <p className="text-xs text-muted-foreground">@{usuario.username}</p>
                </div>

                {!usuario.is_superuser ? (
                  <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                    {usuario.is_active ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => handleDesactivar(usuario.id_usuario)}
                        disabled={isSubmitting}
                      >
                        Desactivar
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleEliminar(usuario.id_usuario)}
                      disabled={isSubmitting}
                    >
                      Eliminar
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </FormPanel>
  )
}
