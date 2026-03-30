"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
      toast.success("Gimnasio creado", {
        description: "El gimnasio se agrego correctamente.",
      })
      return
    }

    toast.error("No pudimos crear el gimnasio", {
      description: result.message,
    })
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
      toast.success("Gimnasio actualizado", {
        description: "Los cambios se guardaron correctamente.",
      })
      return
    }

    toast.error("No pudimos actualizar el gimnasio", {
      description: result.message,
    })
  }

  const handleDelete = async (idGimnasio: number) => {
    const result = await eliminarGimnasio(idGimnasio)

    if (result.ok) {
      toast.success("Gimnasio eliminado", {
        description: "El gimnasio se elimino correctamente.",
      })
      return
    }

    toast.error("No pudimos eliminar el gimnasio", {
      description: result.message,
    })
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_1.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Registrar gimnasio</CardTitle>
          <CardDescription>
            Crea gimnasios con direccion y coordenadas para usarlos en tus sesiones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Nombre del gimnasio"
            value={form.nombre_gimnasio}
            onChange={(event) => setForm((prev) => ({ ...prev, nombre_gimnasio: event.target.value }))}
          />
          <Input
            placeholder="Cadena o marca"
            value={form.nombre_cadena}
            onChange={(event) => setForm((prev) => ({ ...prev, nombre_cadena: event.target.value }))}
          />
          <Input
            placeholder="Direccion"
            value={form.direccion}
            onChange={(event) => setForm((prev) => ({ ...prev, direccion: event.target.value }))}
          />
          <Input
            placeholder="Comuna"
            value={form.comuna}
            onChange={(event) => setForm((prev) => ({ ...prev, comuna: event.target.value }))}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Latitud"
              inputMode="decimal"
              value={form.latitud}
              onChange={(event) => setForm((prev) => ({ ...prev, latitud: event.target.value }))}
            />
            <Input
              placeholder="Longitud"
              inputMode="decimal"
              value={form.longitud}
              onChange={(event) => setForm((prev) => ({ ...prev, longitud: event.target.value }))}
            />
          </div>
          <Button onClick={handleCreate} disabled={submitting}>
            {submitting ? "Guardando..." : "Crear gimnasio"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gestion de gimnasios</CardTitle>
          <CardDescription>Busca, edita y elimina gimnasios registrados.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Buscar por nombre o comuna"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="space-y-3">
            {!loading && gimnasios.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay gimnasios registrados con ese filtro.</p>
            ) : null}

            {gimnasios.map((gimnasio) => (
              <div key={gimnasio.id_gimnasio} className="rounded-lg border p-4">
                {editingId === gimnasio.id_gimnasio ? (
                  <div className="space-y-3">
                    <Input
                      value={editingForm.nombre_gimnasio}
                      onChange={(event) =>
                        setEditingForm((prev) => ({ ...prev, nombre_gimnasio: event.target.value }))
                      }
                    />
                    <Input
                      value={editingForm.nombre_cadena}
                      onChange={(event) =>
                        setEditingForm((prev) => ({ ...prev, nombre_cadena: event.target.value }))
                      }
                    />
                    <Input
                      value={editingForm.direccion}
                      onChange={(event) =>
                        setEditingForm((prev) => ({ ...prev, direccion: event.target.value }))
                      }
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Input
                        value={editingForm.comuna}
                        onChange={(event) =>
                          setEditingForm((prev) => ({ ...prev, comuna: event.target.value }))
                        }
                      />
                      <Input
                        inputMode="decimal"
                        value={editingForm.latitud}
                        onChange={(event) =>
                          setEditingForm((prev) => ({ ...prev, latitud: event.target.value }))
                        }
                      />
                      <Input
                        inputMode="decimal"
                        value={editingForm.longitud}
                        onChange={(event) =>
                          setEditingForm((prev) => ({ ...prev, longitud: event.target.value }))
                        }
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => handleSave(gimnasio.id_gimnasio)} disabled={submitting}>
                        Guardar cambios
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingId(null)
                          setEditingForm(initialForm)
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{gimnasio.nombre_gimnasio}</p>
                      <p className="text-sm text-muted-foreground">
                        {gimnasio.nombre_cadena ?? "Sin cadena"} · {gimnasio.comuna ?? "Sin comuna"}
                      </p>
                      <p className="text-sm text-muted-foreground">{gimnasio.direccion}</p>
                      <p className="text-xs text-muted-foreground">
                        Lat {gimnasio.latitud} · Lng {gimnasio.longitud}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingId(gimnasio.id_gimnasio)
                          setEditingForm(getFormFromGimnasio(gimnasio))
                        }}
                      >
                        Editar
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(gimnasio.id_gimnasio)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
