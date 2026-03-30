"use client"

import { FormEvent, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useEntrenamientos } from "@/modules/entrenamientos/hooks/useEntrenamientos"
import { serieFuerzaCreateSchema, serieFuerzaPatchSchema } from "@/modules/entrenamientos/schemas/entrenamientos.schema"
import { SerieFuerzaResponse } from "@/modules/entrenamientos/types/entrenamientos"

const initialForm = {
  id_ejercicio: "",
  es_calentamiento: false,
  cantidad_peso: "",
  repeticiones: "",
}

const getPayload = (form: typeof initialForm) => ({
  id_ejercicio: Number(form.id_ejercicio),
  es_calentamiento: form.es_calentamiento,
  cantidad_peso: Number(form.cantidad_peso),
  repeticiones: Number(form.repeticiones),
})

const getEditableForm = (serie: SerieFuerzaResponse) => ({
  id_ejercicio: "",
  es_calentamiento: serie.es_calentamiento,
  cantidad_peso: String(serie.cantidad_peso),
  repeticiones: String(serie.repeticiones),
})

export function EntrenamientoActivoCard() {
  const {
    entrenamientoActivo,
    submitting,
    agregarSerieFuerza,
    editarSerieFuerza,
    eliminarSerieFuerza,
    cerrarEntrenoFuerzaActivo,
  } = useEntrenamientos()
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingForm, setEditingForm] = useState(initialForm)

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = serieFuerzaCreateSchema.safeParse(getPayload(form))

    if (!parsed.success) {
      toast.error("Revisa la serie", {
        description: parsed.error.issues[0]?.message ?? "Completa los datos requeridos.",
      })
      return
    }

    const result = await agregarSerieFuerza(parsed.data)

    if (result.ok) {
      setForm(initialForm)
      toast.success("Serie agregada", {
        description: "La serie se guardo correctamente.",
      })
      return
    }

    toast.error("No pudimos guardar la serie", {
      description: result.message,
    })
  }

  const handleSave = async (idFuerzaDetalle: number) => {
    const payload = {
      id_ejercicio: editingForm.id_ejercicio ? Number(editingForm.id_ejercicio) : null,
      es_calentamiento: editingForm.es_calentamiento,
      cantidad_peso: Number(editingForm.cantidad_peso),
      repeticiones: Number(editingForm.repeticiones),
    }

    const parsed = serieFuerzaPatchSchema.safeParse(payload)

    if (!parsed.success) {
      toast.error("Revisa la serie", {
        description: parsed.error.issues[0]?.message ?? "Ajusta los datos antes de guardar.",
      })
      return
    }

    const result = await editarSerieFuerza(idFuerzaDetalle, parsed.data)

    if (result.ok) {
      setEditingId(null)
      setEditingForm(initialForm)
      toast.success("Serie actualizada", {
        description: "Los cambios quedaron guardados.",
      })
      return
    }

    toast.error("No pudimos actualizar la serie", {
      description: result.message,
    })
  }

  const handleDelete = async (idFuerzaDetalle: number) => {
    const result = await eliminarSerieFuerza(idFuerzaDetalle)

    if (result.ok) {
      toast.success("Serie eliminada", {
        description: "La serie fue eliminada correctamente.",
      })
      return
    }

    toast.error("No pudimos eliminar la serie", {
      description: result.message,
    })
  }

  const handleClose = async () => {
    const result = await cerrarEntrenoFuerzaActivo()

    if (result.ok) {
      toast.success("Sesion cerrada", {
        description: "El entrenamiento de fuerza fue finalizado.",
      })
      return
    }

    toast.error("No pudimos cerrar la sesion", {
      description: result.message,
    })
  }

  if (!entrenamientoActivo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Entrenamiento activo</CardTitle>
          <CardDescription>No hay una sesion abierta en este momento.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Inicia un entrenamiento desde la seccion "Iniciar Fuerza" para registrar series aqui.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sesion en curso</CardTitle>
            <CardDescription>Resumen del entrenamiento activo y cierre de la sesion.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Gimnasio</p>
                <p className="font-medium">{entrenamientoActivo.nombre_gimnasio ?? "Sin gimnasio"}</p>
                <p className="text-sm text-muted-foreground">
                  {entrenamientoActivo.nombre_cadena ?? "Sin cadena"}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Inicio</p>
                <p className="font-medium">{entrenamientoActivo.inicio_at}</p>
                <p className="text-sm text-muted-foreground">{entrenamientoActivo.estado}</p>
              </div>
            </div>

            <div className="rounded-lg border p-3 text-sm text-muted-foreground">
              El API actual pide `id_ejercicio`, asi que por ahora el formulario trabaja con ID manual
              hasta que exista catalogo de ejercicios.
            </div>

            <Button variant="destructive" onClick={handleClose} disabled={submitting}>
              {submitting ? "Cerrando..." : "Cerrar entrenamiento"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agregar serie</CardTitle>
            <CardDescription>Registra una nueva serie dentro de la sesion activa.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-3">
              <Input
                type="number"
                placeholder="ID ejercicio"
                value={form.id_ejercicio}
                onChange={(event) => setForm((prev) => ({ ...prev, id_ejercicio: event.target.value }))}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="Peso"
                  value={form.cantidad_peso}
                  onChange={(event) => setForm((prev) => ({ ...prev, cantidad_peso: event.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Repeticiones"
                  value={form.repeticiones}
                  onChange={(event) => setForm((prev) => ({ ...prev, repeticiones: event.target.value }))}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.es_calentamiento}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, es_calentamiento: event.target.checked }))
                  }
                />
                Serie de calentamiento
              </label>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : "Agregar serie"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Series registradas</CardTitle>
          <CardDescription>Administra las series cargadas en el entrenamiento actual.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {entrenamientoActivo.series?.length ? (
            entrenamientoActivo.series.map((serie) => (
              <div key={serie.id_fuerza_detalle} className="rounded-lg border p-4">
                {editingId === serie.id_fuerza_detalle ? (
                  <div className="space-y-3">
                    <Input
                      type="number"
                      placeholder="ID ejercicio (opcional en edicion)"
                      value={editingForm.id_ejercicio}
                      onChange={(event) =>
                        setEditingForm((prev) => ({ ...prev, id_ejercicio: event.target.value }))
                      }
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={editingForm.cantidad_peso}
                        onChange={(event) =>
                          setEditingForm((prev) => ({ ...prev, cantidad_peso: event.target.value }))
                        }
                      />
                      <Input
                        type="number"
                        value={editingForm.repeticiones}
                        onChange={(event) =>
                          setEditingForm((prev) => ({ ...prev, repeticiones: event.target.value }))
                        }
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editingForm.es_calentamiento}
                        onChange={(event) =>
                          setEditingForm((prev) => ({ ...prev, es_calentamiento: event.target.checked }))
                        }
                      />
                      Serie de calentamiento
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => handleSave(serie.id_fuerza_detalle)} disabled={submitting}>
                        Guardar
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
                      <p className="font-medium">
                        {serie.nombre_ejercicio ?? `Ejercicio #${serie.id_fuerza_detalle}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {serie.repeticiones} reps · {serie.cantidad_peso} kg
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {serie.tipo_ejercicio ?? "Tipo no informado"} ·{" "}
                        {serie.es_calentamiento ? "Calentamiento" : "Trabajo"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingId(serie.id_fuerza_detalle)
                          setEditingForm(getEditableForm(serie))
                        }}
                      >
                        Editar
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(serie.id_fuerza_detalle)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              Aun no registras series en esta sesion.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
