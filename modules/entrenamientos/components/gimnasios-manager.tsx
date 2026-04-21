"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EditorialInput, FieldGroup, FormPanel, FormSubmitBar } from "@/components/forms/editorial-form"
import { useEntrenamientos } from "@/modules/entrenamientos/hooks/useEntrenamientos"
import { gimnasioCreateSchema, gimnasioEditSchema } from "@/modules/entrenamientos/schemas/entrenamientos.schema"
import { GimnasioResponse } from "@/modules/entrenamientos/types/entrenamientos"

type GimnasioFormState = {
  nombre_gimnasio: string
  nombre_cadena: string
  direccion: string
  comuna: string
  latitud: string
  longitud: string
}

const initialForm: GimnasioFormState = {
  nombre_gimnasio: "",
  nombre_cadena: "",
  direccion: "",
  comuna: "",
  latitud: "",
  longitud: "",
}

const getPayloadFromForm = (form: GimnasioFormState) => ({
  nombre_gimnasio: form.nombre_gimnasio,
  nombre_cadena: form.nombre_cadena || null,
  direccion: form.direccion,
  comuna: form.comuna || null,
  latitud: Number(form.latitud),
  longitud: Number(form.longitud),
})

const getFormFromGimnasio = (gimnasio: GimnasioResponse): GimnasioFormState => ({
  nombre_gimnasio: gimnasio.nombre_gimnasio,
  nombre_cadena: gimnasio.nombre_cadena ?? "",
  direccion: gimnasio.direccion,
  comuna: gimnasio.comuna ?? "",
  latitud: String(gimnasio.latitud),
  longitud: String(gimnasio.longitud),
})

export function GimnasiosManager() {
  const { gimnasios, loading, submitting, fetchGimnasios, crearGimnasio, editarGimnasio, eliminarGimnasio } =
    useEntrenamientos()
  const [search, setSearch] = useState("")
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingForm, setEditingForm] = useState(initialForm)

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchGimnasios(search.trim() || undefined)
    }, 250)
    return () => clearTimeout(timer)
  }, [fetchGimnasios, search])

  const handleCreate = async () => {
    const parsed = gimnasioCreateSchema.safeParse(getPayloadFromForm(form))
    if (!parsed.success) {
      toast.error("Revisa el formulario", {
        description: parsed.error.issues[0]?.message ?? "Completa los datos del gimnasio.",
      })
      return
    }
    const result = await crearGimnasio({
      ...parsed.data,
      nombre_cadena: parsed.data.nombre_cadena ?? null,
      comuna: parsed.data.comuna ?? null,
    })
    if (result.ok) {
      setForm(initialForm)
      toast.success("Gimnasio creado")
      return
    }
    toast.error("No se pudo crear el gimnasio", { description: result.message })
  }

  const handleSave = async (idGimnasio: number) => {
    const parsed = gimnasioEditSchema.safeParse(getPayloadFromForm(editingForm))
    if (!parsed.success) {
      toast.error("Revisa los cambios", {
        description: parsed.error.issues[0]?.message ?? "Completa los datos del gimnasio.",
      })
      return
    }
    const result = await editarGimnasio(idGimnasio, parsed.data)
    if (result.ok) {
      setEditingId(null)
      setEditingForm(initialForm)
      toast.success("Gimnasio actualizado")
      return
    }
    toast.error("No se pudo actualizar el gimnasio", { description: result.message })
  }

  const handleDelete = async (idGimnasio: number) => {
    const result = await eliminarGimnasio(idGimnasio)
    if (result.ok) {
      toast.success("Gimnasio eliminado")
      return
    }
    toast.error("No se pudo eliminar el gimnasio", { description: result.message })
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
      <FormPanel eyebrow="Nuevo gimnasio">
        <div className="space-y-4 sm:space-y-5">
          <FieldGroup label="Nombre">
            <EditorialInput
              placeholder="Nombre del gimnasio"
              value={form.nombre_gimnasio}
              onChange={(e) => setForm((p) => ({ ...p, nombre_gimnasio: e.target.value }))}
            />
          </FieldGroup>
          <FieldGroup label="Cadena o marca" hint="Opcional">
            <EditorialInput
              placeholder="Ej: Smart Fit"
              value={form.nombre_cadena}
              onChange={(e) => setForm((p) => ({ ...p, nombre_cadena: e.target.value }))}
            />
          </FieldGroup>
          <FieldGroup label="Direccion">
            <EditorialInput
              placeholder="Av. Ejemplo 123"
              value={form.direccion}
              onChange={(e) => setForm((p) => ({ ...p, direccion: e.target.value }))}
            />
          </FieldGroup>
          <FieldGroup label="Comuna" hint="Opcional">
            <EditorialInput
              placeholder="Nunoa"
              value={form.comuna}
              onChange={(e) => setForm((p) => ({ ...p, comuna: e.target.value }))}
            />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Latitud">
              <EditorialInput
                inputMode="decimal"
                placeholder="-33.456"
                value={form.latitud}
                onChange={(e) => setForm((p) => ({ ...p, latitud: e.target.value }))}
              />
            </FieldGroup>
            <FieldGroup label="Longitud">
              <EditorialInput
                inputMode="decimal"
                placeholder="-70.648"
                value={form.longitud}
                onChange={(e) => setForm((p) => ({ ...p, longitud: e.target.value }))}
              />
            </FieldGroup>
          </div>
          <FormSubmitBar>
            <Button onClick={handleCreate} disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Guardando..." : "Crear gimnasio"}
            </Button>
          </FormSubmitBar>
        </div>
      </FormPanel>

      <FormPanel eyebrow="Gestion">
        <div className="space-y-4 sm:space-y-5">
          <FieldGroup label="Buscar">
            <EditorialInput
              placeholder="Nombre o comuna"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FieldGroup>

          <div className="space-y-2">
            {loading ? (
              <p className="text-sm text-muted-foreground">Cargando...</p>
            ) : gimnasios.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay gimnasios con ese filtro.</p>
            ) : null}

            {gimnasios.map((gimnasio) => (
              <div key={gimnasio.id_gimnasio} className="rounded-4xl bg-surface-low p-4">
                {editingId === gimnasio.id_gimnasio ? (
                  <div className="space-y-3">
                    <EditorialInput
                      value={editingForm.nombre_gimnasio}
                      onChange={(e) => setEditingForm((p) => ({ ...p, nombre_gimnasio: e.target.value }))}
                    />
                    <EditorialInput
                      placeholder="Cadena o marca"
                      value={editingForm.nombre_cadena}
                      onChange={(e) => setEditingForm((p) => ({ ...p, nombre_cadena: e.target.value }))}
                    />
                    <EditorialInput
                      placeholder="Direccion"
                      value={editingForm.direccion}
                      onChange={(e) => setEditingForm((p) => ({ ...p, direccion: e.target.value }))}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <EditorialInput
                        placeholder="Comuna"
                        value={editingForm.comuna}
                        onChange={(e) => setEditingForm((p) => ({ ...p, comuna: e.target.value }))}
                      />
                      <EditorialInput
                        inputMode="decimal"
                        placeholder="Latitud"
                        value={editingForm.latitud}
                        onChange={(e) => setEditingForm((p) => ({ ...p, latitud: e.target.value }))}
                      />
                      <EditorialInput
                        inputMode="decimal"
                        placeholder="Longitud"
                        value={editingForm.longitud}
                        onChange={(e) => setEditingForm((p) => ({ ...p, longitud: e.target.value }))}
                      />
                    </div>
                    <FormSubmitBar>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(gimnasio.id_gimnasio)} disabled={submitting}>
                          Guardar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingId(null)
                            setEditingForm(initialForm)
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </FormSubmitBar>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{gimnasio.nombre_gimnasio}</p>
                      <p className="text-xs text-muted-foreground">
                        {gimnasio.nombre_cadena ?? "Sin cadena"} · {gimnasio.comuna ?? "Sin comuna"}
                      </p>
                      <p className="text-xs text-muted-foreground">{gimnasio.direccion}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingId(gimnasio.id_gimnasio)
                          setEditingForm(getFormFromGimnasio(gimnasio))
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(gimnasio.id_gimnasio)}
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
