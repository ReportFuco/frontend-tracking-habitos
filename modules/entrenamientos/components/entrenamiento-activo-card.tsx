"use client"

import Link from "next/link"
import { FormEvent, useEffect, useMemo, useState } from "react"
import { PencilLine, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EditorialSelect, FieldGroup, FormNote, FormPanel } from "@/components/forms/editorial-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEntrenamientos } from "@/modules/entrenamientos/hooks/useEntrenamientos"
import {
  serieFuerzaCreateSchema,
  serieFuerzaPatchSchema,
} from "@/modules/entrenamientos/schemas/entrenamientos.schema"
import { SerieFuerzaResponse } from "@/modules/entrenamientos/types/entrenamientos"

const initialForm = {
  id_ejercicio: "",
  tipo: "",
  es_calentamiento: false,
  cantidad_peso: "",
  repeticiones: "",
}

const inputClassName =
  "h-13 w-full rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-b-2 focus:border-[color:var(--module-entrenamientos)]"

const normalizeText = (value: string | null | undefined) => (value ?? "").trim().toLowerCase()

const getEditableForm = (serie: SerieFuerzaResponse) => ({
  id_ejercicio: "",
  tipo: normalizeText(serie.tipo_ejercicio),
  es_calentamiento: serie.es_calentamiento,
  cantidad_peso: String(serie.cantidad_peso),
  repeticiones: String(serie.repeticiones),
})

export function EntrenamientoActivoCard() {
  const {
    entrenamientoActivo,
    ejercicios,
    tiposMusculares,
    loading,
    submitting,
    fetchEjercicios,
    fetchTiposMusculares,
    agregarSerieFuerza,
    editarSerieFuerza,
    eliminarSerieFuerza,
    cerrarEntrenoFuerzaActivo,
  } = useEntrenamientos()
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingForm, setEditingForm] = useState(initialForm)
  const [closeDialogOpen, setCloseDialogOpen] = useState(false)

  useEffect(() => {
    if (ejercicios.length === 0) {
      void fetchEjercicios()
    }

    if (tiposMusculares.length === 0) {
      void fetchTiposMusculares()
    }
  }, [ejercicios.length, fetchEjercicios, fetchTiposMusculares, tiposMusculares.length])

  const ejerciciosFiltrados = useMemo(() => {
    if (!form.tipo) {
      return ejercicios
    }

    return ejercicios.filter((ejercicio) => normalizeText(ejercicio.tipo) === normalizeText(form.tipo))
  }, [ejercicios, form.tipo])

  const ejerciciosFiltradosEdicion = useMemo(() => {
    if (!editingForm.tipo) {
      return ejercicios
    }

    return ejercicios.filter(
      (ejercicio) => normalizeText(ejercicio.tipo) === normalizeText(editingForm.tipo)
    )
  }, [editingForm.tipo, ejercicios])

  const totalSeries = entrenamientoActivo?.series?.length ?? 0

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = serieFuerzaCreateSchema.safeParse({
      id_ejercicio: Number(form.id_ejercicio),
      es_calentamiento: form.es_calentamiento,
      cantidad_peso: Number(form.cantidad_peso),
      repeticiones: Number(form.repeticiones),
    })

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
        description: "Tu registro ya quedo guardado en esta sesion.",
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
        description: "Los cambios ya quedaron guardados.",
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
        description: "La quitamos de esta sesion.",
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
        description: "Tu entrenamiento ya paso al historico.",
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
            Primero abre tu entrenamiento y luego vuelve aqui para empezar a registrar tus series.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[color:var(--module-entrenamientos)] text-[color:var(--tertiary-foreground)] hover:bg-[color:var(--module-entrenamientos)]/90"
            >
              <Link href="/app/entrenamientos/registrar">Registrar entrenamiento</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
      <section className="rounded-[1.75rem] bg-[color:var(--surface-low)] p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-label text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
              Sesion actual
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Series registradas
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-secondary/12 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-secondary">
              {totalSeries} serie{totalSeries === 1 ? "" : "s"}
            </span>
            <Button
              variant="ghost"
              onClick={() => setCloseDialogOpen(true)}
              disabled={submitting}
              className="text-foreground hover:text-primary"
            >
              {submitting ? "Cerrando..." : "Cerrar entrenamiento"}
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {entrenamientoActivo.series?.length ? (
            entrenamientoActivo.series.map((serie) => (
              <article
                key={serie.id_fuerza_detalle}
                className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-5 shadow-[var(--shadow-airy)] ring-1 ring-primary/6"
              >
                {editingId === serie.id_fuerza_detalle ? (
                  <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FieldGroup label="Musculo">
                        <EditorialSelect
                          value={editingForm.tipo}
                          onChange={(event) =>
                            setEditingForm((prev) => ({
                              ...prev,
                              tipo: event.target.value,
                              id_ejercicio: "",
                            }))
                          }
                          className="focus:border-primary"
                        >
                          <option value="">Selecciona un grupo muscular</option>
                          {tiposMusculares.map((tipo) => (
                            <option key={tipo} value={tipo}>
                              {tipo}
                            </option>
                          ))}
                        </EditorialSelect>
                      </FieldGroup>

                      <FieldGroup label="Ejercicio">
                        <EditorialSelect
                          value={editingForm.id_ejercicio}
                          onChange={(event) =>
                            setEditingForm((prev) => ({ ...prev, id_ejercicio: event.target.value }))
                          }
                          className="focus:border-primary"
                        >
                          <option value="">Mantener ejercicio actual</option>
                          {ejerciciosFiltradosEdicion.map((ejercicio) => (
                            <option key={ejercicio.id_ejercicio} value={ejercicio.id_ejercicio}>
                              {ejercicio.nombre}
                            </option>
                          ))}
                        </EditorialSelect>
                      </FieldGroup>
                    </div>

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

                    <label className="flex items-center gap-3 rounded-[1rem] bg-primary/6 px-4 py-3 text-sm text-foreground">
                      <input
                        type="checkbox"
                        className="size-4 accent-primary"
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
                        className="bg-primary text-[color:var(--primary-foreground)] hover:bg-primary/90"
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
                          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            {serie.tipo_ejercicio ?? "grupo no informado"}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${
                              serie.es_calentamiento
                                ? "bg-primary/12 text-primary"
                                : "bg-primary/8 text-foreground"
                            }`}
                          >
                            {serie.es_calentamiento ? "calentamiento" : "trabajo"}
                          </span>
                        </div>
                        <p className="text-lg font-semibold tracking-tight text-foreground">
                          {serie.nombre_ejercicio ?? `Serie #${serie.id_fuerza_detalle}`}
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
                        className="text-foreground hover:text-primary"
                      >
                        <PencilLine className="mr-2 size-4" />
                        Editar
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
            <div className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 text-sm leading-6 text-muted-foreground shadow-[var(--shadow-airy)] ring-1 ring-primary/6">
              Aun no registras series en esta sesion. Cuando agregues la primera, la veras aqui de inmediato.
            </div>
          )}
        </div>
      </section>

      <div className="space-y-6">
        <FormPanel
          eyebrow="Nueva serie"
          title="Registrar serie"
          description="Elige el grupo muscular, luego el ejercicio y por ultimo registra tu carga y repeticiones."
          accent="primary"
        >
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="grid gap-5">
              <FieldGroup label="Grupo muscular">
                <EditorialSelect
                  value={form.tipo}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      tipo: event.target.value,
                      id_ejercicio: "",
                    }))
                  }
                  disabled={submitting || loading}
                  className="focus:border-primary"
                >
                  <option value="">Selecciona un grupo muscular</option>
                  {tiposMusculares.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </EditorialSelect>
              </FieldGroup>

              <FieldGroup label="Ejercicio" hint={form.tipo ? "Disponible para el grupo elegido" : ""}>
                <EditorialSelect
                  value={form.id_ejercicio}
                  onChange={(event) => setForm((prev) => ({ ...prev, id_ejercicio: event.target.value }))}
                  disabled={submitting || ejerciciosFiltrados.length === 0}
                  className="focus:border-primary"
                >
                  <option value="">
                    {form.tipo ? "Selecciona un ejercicio" : "Primero elige un grupo muscular"}
                  </option>
                  {ejerciciosFiltrados.map((ejercicio) => (
                    <option key={ejercicio.id_ejercicio} value={ejercicio.id_ejercicio}>
                      {ejercicio.nombre}
                    </option>
                  ))}
                </EditorialSelect>
              </FieldGroup>
            </div>

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

            <label className="flex items-center gap-3 rounded-[1rem] bg-primary/6 px-4 py-3 text-sm text-foreground">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={form.es_calentamiento}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, es_calentamiento: event.target.checked }))
                }
              />
              Marcar como serie de calentamiento
            </label>

            <FormNote>
              Esta sesion se esta registrando en{" "}
              <span className="font-medium text-foreground">
                {entrenamientoActivo.nombre_gimnasio ?? "tu gimnasio actual"}
              </span>
              .
            </FormNote>

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={submitting || !form.id_ejercicio}
                className="bg-primary text-[color:var(--primary-foreground)] hover:bg-primary/90"
              >
                {submitting ? "Guardando..." : "Agregar serie"}
              </Button>
            </div>
          </form>
        </FormPanel>
      </div>

      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent className="max-w-xl rounded-[1.75rem] border-0 bg-[color:var(--surface-lowest)] p-0 shadow-[var(--shadow-airy-lg)]">
          <div className="bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_14%,white),transparent_70%)] px-6 py-6 sm:px-7">
            <DialogHeader className="text-left">
              <p className="font-label text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground">
                Confirmacion
              </p>
              <DialogTitle className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                Estas seguro de cerrar el entrenamiento?
              </DialogTitle>
              <DialogDescription className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                Si cierras la sesion ahora, este entrenamiento pasara al historico y dejaras de registrar series en curso.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 pb-6 sm:px-7">
            <div className="rounded-[1.5rem] bg-[color:var(--surface-low)] p-5">
              <p className="text-lg font-semibold tracking-tight text-foreground">
                {entrenamientoActivo.nombre_gimnasio ?? "Entrenamiento actual"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {totalSeries} serie{totalSeries === 1 ? "" : "s"} registradas en esta sesion.
              </p>
            </div>

            <DialogFooter className="mt-5">
              <Button variant="ghost" onClick={() => setCloseDialogOpen(false)}>
                Seguir entrenando
              </Button>
              <Button
                onClick={async () => {
                  await handleClose()
                  setCloseDialogOpen(false)
                }}
                disabled={submitting}
                className="bg-primary text-[color:var(--primary-foreground)] hover:bg-primary/90"
              >
                {submitting ? "Cerrando..." : "Si, cerrar entrenamiento"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
