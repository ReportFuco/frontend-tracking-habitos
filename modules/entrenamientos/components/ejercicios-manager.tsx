"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EditorialInput, FieldGroup, FormPanel, FormSubmitBar } from "@/components/forms/editorial-form"
import { EntrenamientosAPI } from "@/modules/entrenamientos/api/entrenamientos.api"
import type { EjercicioResponse } from "@/modules/entrenamientos/types/entrenamientos"

type EjercicioFormState = { nombre: string; tipo: string; url_video: string }
const emptyForm: EjercicioFormState = { nombre: "", tipo: "", url_video: "" }

export function EjerciciosManager() {
  const [ejercicios, setEjercicios] = useState<EjercicioResponse[]>([])
  const [tiposMusculares, setTiposMusculares] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState<EjercicioFormState>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingForm, setEditingForm] = useState<EjercicioFormState>(emptyForm)

  useEffect(() => {
    void EntrenamientosAPI.getTiposMusculares().then(setTiposMusculares).catch(() => null)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      void EntrenamientosAPI.getEjercicios(search.trim() ? { q: search.trim() } : undefined)
        .then(setEjercicios)
        .catch(() => toast.error("Error al cargar ejercicios"))
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timer)
  }, [search])

  const handleCreate = async () => {
    if (!form.nombre.trim() || !form.tipo.trim()) {
      toast.error("Nombre y grupo muscular son requeridos")
      return
    }
    setSubmitting(true)
    try {
      const nuevo = await EntrenamientosAPI.createEjercicio({
        nombre: form.nombre.trim(),
        tipo: form.tipo.trim(),
        ...(form.url_video.trim() ? { url_video: form.url_video.trim() } : {}),
      })
      setEjercicios((prev) => [...prev, nuevo])
      setForm(emptyForm)
      toast.success("Ejercicio creado")
    } catch {
      toast.error("No se pudo crear el ejercicio")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSave = async (idEjercicio: number) => {
    if (!editingForm.nombre.trim() || !editingForm.tipo.trim()) {
      toast.error("Nombre y grupo muscular son requeridos")
      return
    }
    setSubmitting(true)
    try {
      const updated = await EntrenamientosAPI.updateEjercicio(idEjercicio, {
        nombre: editingForm.nombre.trim(),
        tipo: editingForm.tipo.trim(),
        ...(editingForm.url_video.trim() ? { url_video: editingForm.url_video.trim() } : { url_video: null }),
      })
      setEjercicios((prev) => prev.map((e) => (e.id_ejercicio === idEjercicio ? updated : e)))
      setEditingId(null)
      toast.success("Ejercicio actualizado")
    } catch {
      toast.error("No se pudo actualizar el ejercicio")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (idEjercicio: number) => {
    setSubmitting(true)
    try {
      await EntrenamientosAPI.deleteEjercicio(idEjercicio)
      setEjercicios((prev) => prev.filter((e) => e.id_ejercicio !== idEjercicio))
      toast.success("Ejercicio eliminado")
    } catch {
      toast.error("No se pudo eliminar. Puede tener series asociadas.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
      <FormPanel eyebrow="Nuevo ejercicio">
        <div className="space-y-4 sm:space-y-5">
          <FieldGroup label="Nombre">
            <EditorialInput
              placeholder="Ej: Press banca plano"
              value={form.nombre}
              onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
            />
          </FieldGroup>
          <FieldGroup label="Grupo muscular">
            {tiposMusculares.length > 0 ? (
              <select
                value={form.tipo}
                onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
                className="h-13 w-full rounded-3xl border-0 bg-surface-variant px-4 text-sm text-foreground shadow-none outline-none transition focus:border-b-2 focus:border-primary"
              >
                <option value="">Selecciona un grupo</option>
                {tiposMusculares.map((tipo) => (
                  <option key={tipo} value={tipo} className="capitalize">
                    {tipo}
                  </option>
                ))}
              </select>
            ) : (
              <EditorialInput
                placeholder="Ej: pecho, espalda, pierna"
                value={form.tipo}
                onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
              />
            )}
          </FieldGroup>
          <FieldGroup label="URL video" hint="Opcional">
            <EditorialInput
              type="url"
              placeholder="https://youtube.com/..."
              value={form.url_video}
              onChange={(e) => setForm((p) => ({ ...p, url_video: e.target.value }))}
            />
          </FieldGroup>
          <FormSubmitBar>
            <Button onClick={handleCreate} disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Guardando..." : "Crear ejercicio"}
            </Button>
          </FormSubmitBar>
        </div>
      </FormPanel>

      <FormPanel eyebrow="Gestion">
        <div className="space-y-4 sm:space-y-5">
          <FieldGroup label="Buscar">
            <EditorialInput
              placeholder="Nombre del ejercicio"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FieldGroup>

          <div className="space-y-2">
            {loading ? (
              <p className="text-sm text-muted-foreground">Cargando...</p>
            ) : ejercicios.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay ejercicios con ese filtro.</p>
            ) : null}

            {ejercicios.map((ej) => (
              <div key={ej.id_ejercicio} className="rounded-4xl bg-surface-low p-4">
                {editingId === ej.id_ejercicio ? (
                  <div className="space-y-3">
                    <EditorialInput
                      value={editingForm.nombre}
                      onChange={(e) => setEditingForm((p) => ({ ...p, nombre: e.target.value }))}
                      autoFocus
                    />
                    <EditorialInput
                      placeholder="Grupo muscular"
                      value={editingForm.tipo}
                      onChange={(e) => setEditingForm((p) => ({ ...p, tipo: e.target.value }))}
                    />
                    <EditorialInput
                      type="url"
                      placeholder="URL video"
                      value={editingForm.url_video}
                      onChange={(e) => setEditingForm((p) => ({ ...p, url_video: e.target.value }))}
                    />
                    <FormSubmitBar>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(ej.id_ejercicio)} disabled={submitting}>
                          Guardar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </FormSubmitBar>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{ej.nombre}</p>
                      <p className="text-xs capitalize text-muted-foreground">{ej.tipo}</p>
                      {ej.url_video ? (
                        <a
                          href={ej.url_video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground underline"
                        >
                          Ver video
                        </a>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingId(ej.id_ejercicio)
                          setEditingForm({ nombre: ej.nombre, tipo: ej.tipo, url_video: ej.url_video ?? "" })
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(ej.id_ejercicio)}
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
        </div>
      </FormPanel>
    </section>
  )
}
