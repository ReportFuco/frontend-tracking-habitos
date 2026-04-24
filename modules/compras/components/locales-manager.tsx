"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EditorialInput, FieldGroup, FormPanel, FormSubmitBar } from "@/components/forms/editorial-form"
import { ComprasAPI } from "@/modules/compras/api/compras.api"
import type { LocalResponse, CadenaResponse } from "@/modules/compras/types/compras"

const SELECT_CLASS =
  "h-13 w-full rounded-3xl border-0 bg-surface-variant px-4 text-sm text-foreground shadow-none outline-none transition focus:border-b-2 focus:border-primary"

type LocalFormState = {
  nombre_local: string
  id_cadena: string
  direccion: string
  latitud: string
  longitud: string
}

const emptyForm: LocalFormState = {
  nombre_local: "",
  id_cadena: "",
  direccion: "",
  latitud: "",
  longitud: "",
}

const toPayload = (f: LocalFormState) => ({
  nombre_local: f.nombre_local.trim(),
  id_cadena: f.id_cadena ? Number(f.id_cadena) : null,
  direccion: f.direccion.trim() || null,
  latitud: f.latitud ? Number(f.latitud) : null,
  longitud: f.longitud ? Number(f.longitud) : null,
})

const toFormState = (local: LocalResponse): LocalFormState => ({
  nombre_local: local.nombre_local,
  id_cadena: local.id_cadena != null ? String(local.id_cadena) : "",
  direccion: local.direccion ?? "",
  latitud: local.latitud != null ? String(local.latitud) : "",
  longitud: local.longitud != null ? String(local.longitud) : "",
})

export function LocalesManager() {
  const [locales, setLocales] = useState<LocalResponse[]>([])
  const [cadenas, setCadenas] = useState<CadenaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<LocalFormState>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingForm, setEditingForm] = useState<LocalFormState>(emptyForm)

  useEffect(() => {
    void Promise.all([ComprasAPI.getLocales(), ComprasAPI.getCadenas()])
      .then(([ls, cs]) => {
        setLocales(ls)
        setCadenas(cs)
      })
      .catch(() => toast.error("Error al cargar datos"))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!form.nombre_local.trim()) {
      toast.error("Nombre requerido")
      return
    }
    setSubmitting(true)
    try {
      const local = await ComprasAPI.createLocal(toPayload(form))
      setLocales((prev) => [...prev, local])
      setForm(emptyForm)
      toast.success("Local creado")
    } catch {
      toast.error("No se pudo crear el local")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSave = async (idLocal: number) => {
    if (!editingForm.nombre_local.trim()) {
      toast.error("Nombre requerido")
      return
    }
    setSubmitting(true)
    try {
      const updated = await ComprasAPI.updateLocal(idLocal, toPayload(editingForm))
      setLocales((prev) => prev.map((l) => (l.id_local === idLocal ? updated : l)))
      setEditingId(null)
      toast.success("Local actualizado")
    } catch {
      toast.error("No se pudo actualizar el local")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (idLocal: number) => {
    setSubmitting(true)
    try {
      await ComprasAPI.deleteLocal(idLocal)
      setLocales((prev) => prev.filter((l) => l.id_local !== idLocal))
      toast.success("Local eliminado")
    } catch {
      toast.error("No se pudo eliminar el local")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
      <FormPanel eyebrow="Nuevo local">
        <div className="space-y-4 sm:space-y-5">
          <FieldGroup label="Nombre">
            <EditorialInput
              placeholder="Ej: Lider Nunoa"
              value={form.nombre_local}
              onChange={(e) => setForm((p) => ({ ...p, nombre_local: e.target.value }))}
            />
          </FieldGroup>
          <FieldGroup label="Cadena" hint="Opcional">
            <select
              value={form.id_cadena}
              onChange={(e) => setForm((p) => ({ ...p, id_cadena: e.target.value }))}
              className={SELECT_CLASS}
            >
              <option value="">Sin cadena</option>
              {cadenas.map((c) => (
                <option key={c.id_cadena} value={c.id_cadena}>
                  {c.nombre_cadena}
                </option>
              ))}
            </select>
          </FieldGroup>
          <FieldGroup label="Direccion" hint="Opcional">
            <EditorialInput
              placeholder="Av. Ejemplo 123"
              value={form.direccion}
              onChange={(e) => setForm((p) => ({ ...p, direccion: e.target.value }))}
            />
          </FieldGroup>
          <FieldGroup label="Coordenadas" hint="Opcional">
            <div className="grid grid-cols-2 gap-2">
              <EditorialInput
                type="number"
                placeholder="Latitud"
                value={form.latitud}
                onChange={(e) => setForm((p) => ({ ...p, latitud: e.target.value }))}
              />
              <EditorialInput
                type="number"
                placeholder="Longitud"
                value={form.longitud}
                onChange={(e) => setForm((p) => ({ ...p, longitud: e.target.value }))}
              />
            </div>
          </FieldGroup>
          <FormSubmitBar>
            <Button onClick={handleCreate} disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Guardando..." : "Crear local"}
            </Button>
          </FormSubmitBar>
        </div>
      </FormPanel>

      <FormPanel eyebrow="Gestion">
        <div className="space-y-2">
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : locales.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay locales registrados.</p>
          ) : null}

          {locales.map((local) => (
            <div key={local.id_local} className="rounded-4xl bg-surface-low p-4">
              {editingId === local.id_local ? (
                <div className="space-y-3">
                  <EditorialInput
                    value={editingForm.nombre_local}
                    onChange={(e) => setEditingForm((p) => ({ ...p, nombre_local: e.target.value }))}
                    autoFocus
                  />
                  <select
                    value={editingForm.id_cadena}
                    onChange={(e) => setEditingForm((p) => ({ ...p, id_cadena: e.target.value }))}
                    className={SELECT_CLASS}
                  >
                    <option value="">Sin cadena</option>
                    {cadenas.map((c) => (
                      <option key={c.id_cadena} value={c.id_cadena}>
                        {c.nombre_cadena}
                      </option>
                    ))}
                  </select>
                  <EditorialInput
                    placeholder="Direccion"
                    value={editingForm.direccion}
                    onChange={(e) => setEditingForm((p) => ({ ...p, direccion: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <EditorialInput
                      type="number"
                      placeholder="Latitud"
                      value={editingForm.latitud}
                      onChange={(e) => setEditingForm((p) => ({ ...p, latitud: e.target.value }))}
                    />
                    <EditorialInput
                      type="number"
                      placeholder="Longitud"
                      value={editingForm.longitud}
                      onChange={(e) => setEditingForm((p) => ({ ...p, longitud: e.target.value }))}
                    />
                  </div>
                  <FormSubmitBar>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(local.id_local)} disabled={submitting}>
                        Guardar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </FormSubmitBar>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{local.nombre_local}</p>
                    {local.nombre_cadena ? (
                      <p className="text-xs text-muted-foreground">{local.nombre_cadena}</p>
                    ) : null}
                    {local.direccion ? (
                      <p className="text-xs text-muted-foreground">{local.direccion}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setEditingId(local.id_local)
                        setEditingForm(toFormState(local))
                      }}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(local.id_local)}
                      disabled={submitting}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </FormPanel>
    </section>
  )
}
