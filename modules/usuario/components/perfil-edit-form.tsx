"use client"

import { FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { usuarioPerfilPatchSchema } from "@/modules/usuario/schemas/usuario.schema"
import type { Usuario, UsuarioPerfilPatch } from "@/modules/usuario/types/usuario"

interface PerfilEditFormProps {
  perfil: Usuario
  submitting: boolean
  onSubmit: (payload: UsuarioPerfilPatch) => Promise<{ ok: boolean; message?: string }>
}

type FormState = {
  username: string
  nombre: string
  apellido: string
  telefono: string
  email: string
}

const toFormState = (perfil: Usuario): FormState => ({
  username: perfil.username ?? "",
  nombre: perfil.nombre ?? "",
  apellido: perfil.apellido ?? "",
  telefono: perfil.telefono ?? "",
  email: perfil.email ?? "",
})

const diffPayload = (current: FormState, original: FormState): UsuarioPerfilPatch => {
  const payload: UsuarioPerfilPatch = {}
  if (current.username !== original.username) payload.username = current.username
  if (current.nombre !== original.nombre) payload.nombre = current.nombre
  if (current.apellido !== original.apellido) payload.apellido = current.apellido
  if (current.telefono !== original.telefono) payload.telefono = current.telefono
  if (current.email !== original.email) payload.email = current.email
  return payload
}

export function PerfilEditForm({ perfil, submitting, onSubmit }: PerfilEditFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(perfil))

  useEffect(() => {
    setForm(toFormState(perfil))
  }, [perfil])

  const original = toFormState(perfil)
  const payload = diffPayload(form, original)
  const hasChanges = Object.keys(payload).length > 0

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!hasChanges) {
      toast.info("No hay cambios para guardar")
      return
    }

    const parsed = usuarioPerfilPatchSchema.safeParse(payload)
    if (!parsed.success) {
      toast.error("Revisa el formulario", {
        description: parsed.error.issues[0]?.message ?? "Algun campo no es valido.",
      })
      return
    }

    const result = await onSubmit(parsed.data)
    if (result.ok) {
      toast.success("Perfil actualizado")
    } else {
      toast.error("No pudimos actualizar el perfil", { description: result.message })
    }
  }

  const handleReset = () => setForm(original)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos personales</CardTitle>
        <CardDescription>
          Actualiza tus datos. Solo se envian los campos modificados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="perfil-username">
              Username
            </label>
            <Input
              id="perfil-username"
              value={form.username}
              maxLength={20}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, username: event.target.value }))
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="perfil-email">
              Email
            </label>
            <Input
              id="perfil-email"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="perfil-nombre">
              Nombre
            </label>
            <Input
              id="perfil-nombre"
              value={form.nombre}
              maxLength={20}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, nombre: event.target.value }))
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="perfil-apellido">
              Apellido
            </label>
            <Input
              id="perfil-apellido"
              value={form.apellido}
              maxLength={20}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, apellido: event.target.value }))
              }
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="perfil-telefono">
              Telefono
            </label>
            <Input
              id="perfil-telefono"
              value={form.telefono}
              maxLength={11}
              inputMode="tel"
              onChange={(event) =>
                setForm((prev) => ({ ...prev, telefono: event.target.value }))
              }
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
            <Button type="submit" disabled={submitting || !hasChanges}>
              {submitting ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              disabled={submitting || !hasChanges}
            >
              Descartar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
