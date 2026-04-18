"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { Dumbbell, PencilLine, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { FieldGroup, FormNote, FormPanel } from "@/components/forms/editorial-form"
import { useEntrenamientos } from "@/modules/entrenamientos/hooks/useEntrenamientos"
import {
  serieFuerzaCreateSchema,
  serieFuerzaPatchSchema,
} from "@/modules/entrenamientos/schemas/entrenamientos.schema"
import { SerieFuerzaResponse } from "@/modules/entrenamientos/types/entrenamientos"

const initialForm = {
  id_ejercicio: "",
  es_calentamiento: false,
  cantidad_peso: "",
  repeticiones: "",
}

const inputClassName =
  "h-13 w-full rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-b-2 focus:border-[color:var(--module-entrenamientos)]"

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
        description: "El entrenamiento paso al historico.",
      })
      return
    }

    toast.error("No pudimos cerrar la sesion", {
      description: result.message,
    })
  }

  if (!entrenamientoActivo) {
    return (
      <section className="rounded-[1.75rem] bg-[color:var(--surface-low)] p-6">
        <div className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)]">
          <p className="font-label text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground">
            Sin sesion activa
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground">
            Todavia no hay un entrenamiento en curso.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            El registro de series vive dentro de una sesion activa. Primero abre tu entrenamiento y despues vuelve aqui para cargar cada serie.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild className="bg-[color:var(--module-entrenamientos)] text-[color:var(--tertiary-foreground)] hover:bg-[color:var(--module-entrenamientos)]/90">
              <Link href="/app/entrenamientos/registrar">Registrar entrenamiento</Link>
            </Button>
            <Button asChild variant="ghost" className="text-foreground hover:text-[color:var(--module-entrenamientos)]">
              <Link href="/app/entrenamientos/historico">Ver entrenamientos anteriores</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
      <div className="space-y-6">
        <FormPanel
          eyebrow="Activo"
          title="Sesion en curso"
          description="Este es el espacio para registrar series mientras entrenas. La sesion ya esta abierta; ahora el protagonismo lo tienen las cargas, repeticiones y ajustes."
          accent="tertiary"
          aside={
            <div className="space-y-4">
              <div className="rounded-[1.25rem] bg-white/70 p-4">
                <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Gimnasio
                </p>
                <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                  {entrenamientoActivo.nombre_gimnasio ?? "Sin gimnasio"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {entrenamientoActivo.nombre_cadena ?? "Cadena no informada"}
                </p>
              </div>

              <div className="rounded-[1.25rem] bg-white/70 p-4">
                <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Series
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  {entrenamientoActivo.series?.length ?? 0}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Total cargado en la sesion actual.
                </p>
              </div>
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[color:var(--surface-low)] p-5">
              <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                Inicio
              </p>
              <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                {entrenamientoActivo.inicio_at}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{entrenamientoActivo.estado}</p>
            </div>

            <div className="rounded-[1.5rem] bg-[color:var(--surface-low)] p-5">
              <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                Ubicacion
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground">
                {entrenamientoActivo.direccion ?? "Direccion no informada"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{entrenamientoActivo.comuna ?? "-"}</p>
            </div>
          </div>

          <FormNote>
            El API actual sigue pidiendo <span className="font-medium text-foreground">id_ejercicio</span>.
            Por ahora lo tratamos de forma honesta dentro del formulario, sin disfrazarlo como si ya existiera un catalogo completo.
          </FormNote>

          <div className="mt-5">
            <Button
              variant="destructive"
              onClick={handleClose}
              disabled={submitting}
              className="bg-[color:var(--module-entrenamientos)] text-[color:var(--tertiary-foreground)] hover:bg-[color:var(--module-entrenamientos)]/90"
            >
              {submitting ? "Cerrando sesion..." : "Cerrar entrenamiento"}
            </Button>
          </div>
        </FormPanel>

        <FormPanel
          eyebrow="Series"
          title="Registrar serie"
          description="Cada serie se registra dentro del entrenamiento activo. Este bloque reemplaza el formulario generico por una captura mas alineada con el contexto del modulo."
          accent="tertiary"
        >
          <form onSubmit={handleCreate} className="space-y-5">
            <FieldGroup label="Ejercicio" hint="ID requerido por API">
              <input
                type="number"
                className={inputClassName}
                placeholder="ID del ejercicio"
                value={form.id_ejercicio}
                onChange={(event) => setForm((prev) => ({ ...prev, id_ejercicio: event.target.value }))}
              />
            </FieldGroup>

            <div className="grid gap-5 sm:grid-cols-2">
              <FieldGroup label="Peso" hint="Kg">
                <input
                  type="number"
                  inputMode="decimal"
                  className={inputClassName}
                  placeholder="Ej: 60"
                  value={form.cantidad_peso}
                  onChange={(event) => setForm((prev) => ({ ...prev, cantidad_peso: event.target.value }))}
                />
              </FieldGroup>

              <FieldGroup label="Repeticiones">
                <input
                  type="number"
                  className={inputClassName}
                  placeholder="Ej: 10"
                  value={form.repeticiones}
                  onChange={(event) => setForm((prev) => ({ ...prev, repeticiones: event.target.value }))}
                />
              </FieldGroup>
            </div>

            <label className="flex items-center gap-3 rounded-[1rem] bg-[color:var(--surface-low)] px-4 py-3 text-sm text-foreground">
              <input
                type="checkbox"
                className="size-4 accent-[color:var(--module-entrenamientos)]"
                checked={form.es_calentamiento}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, es_calentamiento: event.target.checked }))
                }
              />
              Marcar como serie de calentamiento
            </label>

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[color:var(--module-entrenamientos)] text-[color:var(--tertiary-foreground)] hover:bg-[color:var(--module-entrenamientos)]/90"
              >
                {submitting ? "Guardando..." : "Agregar serie"}
              </Button>
            </div>
          </form>
        </FormPanel>
      </div>

      <section className="rounded-[1.75rem] bg-[color:var(--surface-low)] p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-label text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
              Registro actual
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Series cargadas
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Aqui puedes corregir o eliminar series sin salir de la sesion.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {entrenamientoActivo.series?.length ? (
            entrenamientoActivo.series.map((serie) => (
              <article
                key={serie.id_fuerza_detalle}
                className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-5 shadow-[var(--shadow-airy)]"
              >
                {editingId === serie.id_fuerza_detalle ? (
                  <div className="space-y-5">
                    <FieldGroup label="Ejercicio" hint="Opcional en edicion">
                      <input
                        type="number"
                        className={inputClassName}
                        placeholder="ID del ejercicio"
                        value={editingForm.id_ejercicio}
                        onChange={(event) =>
                          setEditingForm((prev) => ({ ...prev, id_ejercicio: event.target.value }))
                        }
                      />
                    </FieldGroup>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <FieldGroup label="Peso" hint="Kg">
                        <input
                          type="number"
                          inputMode="decimal"
                          className={inputClassName}
                          value={editingForm.cantidad_peso}
                          onChange={(event) =>
                            setEditingForm((prev) => ({ ...prev, cantidad_peso: event.target.value }))
                          }
                        />
                      </FieldGroup>

                      <FieldGroup label="Repeticiones">
                        <input
                          type="number"
                          className={inputClassName}
                          value={editingForm.repeticiones}
                          onChange={(event) =>
                            setEditingForm((prev) => ({ ...prev, repeticiones: event.target.value }))
                          }
                        />
                      </FieldGroup>
                    </div>

                    <label className="flex items-center gap-3 rounded-[1rem] bg-[color:var(--surface-low)] px-4 py-3 text-sm text-foreground">
                      <input
                        type="checkbox"
                        className="size-4 accent-[color:var(--module-entrenamientos)]"
                        checked={editingForm.es_calentamiento}
                        onChange={(event) =>
                          setEditingForm((prev) => ({
                            ...prev,
                            es_calentamiento: event.target.checked,
                          }))
                        }
                      />
                      Serie de calentamiento
                    </label>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => handleSave(serie.id_fuerza_detalle)}
                        disabled={submitting}
                        className="bg-[color:var(--module-entrenamientos)] text-[color:var(--tertiary-foreground)] hover:bg-[color:var(--module-entrenamientos)]/90"
                      >
                        Guardar cambios
                      </Button>
                      <Button
                        variant="ghost"
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
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${
                              serie.es_calentamiento
                                ? "bg-tertiary/12 text-tertiary"
                                : "bg-[color:var(--surface-low)] text-foreground"
                            }`}
                          >
                            {serie.es_calentamiento ? "calentamiento" : "trabajo"}
                          </span>
                          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            {serie.tipo_ejercicio ?? "tipo no informado"}
                          </span>
                        </div>
                        <p className="text-lg font-semibold tracking-tight text-foreground">
                          {serie.nombre_ejercicio ?? `Ejercicio #${serie.id_fuerza_detalle}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold tracking-tight text-foreground">
                          {serie.cantidad_peso} kg
                        </p>
                        <p className="text-sm text-muted-foreground">{serie.repeticiones} repeticiones</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingId(serie.id_fuerza_detalle)
                          setEditingForm(getEditableForm(serie))
                        }}
                        className="text-foreground hover:text-[color:var(--module-entrenamientos)]"
                      >
                        <PencilLine className="mr-2 size-4" />
                        Editar serie
                      </Button>
                      <Button variant="ghost" onClick={() => handleDelete(serie.id_fuerza_detalle)}>
                        <Trash2 className="mr-2 size-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 text-sm leading-6 text-muted-foreground shadow-[var(--shadow-airy)]">
              Aun no registras series en esta sesion. Empieza con la primera carga desde el panel de la izquierda.
            </div>
          )}
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-5 shadow-[var(--shadow-airy)]">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Dumbbell className="size-4 text-[color:var(--module-entrenamientos)]" />
            Recordatorio del flujo
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Registrar entrenamiento abre la sesion. Entrenamiento activo administra las series. Cuando cierres la sesion, la veras dentro de entrenamientos anteriores.
          </p>
        </div>
      </section>
    </section>
  )
}
