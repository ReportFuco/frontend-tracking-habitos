"use client"

import Link from "next/link"
import { FormEvent, useEffect, useMemo, useState } from "react"
import { ArrowRight, PencilLine, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { SearchableCombobox } from "@/components/forms/searchable-combobox"
import { Button } from "@/components/ui/button"
import { FieldGroup, FormNote, FormPanel } from "@/components/forms/editorial-form"
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
  "h-12 w-full rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-b-2 focus:border-[color:var(--module-entrenamientos)] sm:h-13"

const normalizeText = (value: string | null | undefined) => (value ?? "").trim().toLowerCase()

const getEditableForm = (serie: SerieFuerzaResponse) => ({
  id_ejercicio: "",
  tipo: serie.tipo_ejercicio ?? "",
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
      return []
    }

    return ejercicios.filter((ejercicio) => normalizeText(ejercicio.tipo) === normalizeText(form.tipo))
  }, [ejercicios, form.tipo])

  const ejerciciosFiltradosEdicion = useMemo(() => {
    if (!editingForm.tipo) {
      return []
    }

    return ejercicios.filter(
      (ejercicio) => normalizeText(ejercicio.tipo) === normalizeText(editingForm.tipo)
    )
  }, [editingForm.tipo, ejercicios])

  const tipoMuscularOptions = useMemo(
    () =>
      tiposMusculares.map((tipo) => ({
        value: tipo,
        label: tipo,
      })),
    [tiposMusculares]
  )

  const ejercicioOptions = useMemo(
    () =>
      ejerciciosFiltrados.map((ejercicio) => ({
        value: String(ejercicio.id_ejercicio),
        label: ejercicio.nombre,
        description: ejercicio.tipo || undefined,
      })),
    [ejerciciosFiltrados]
  )

  const ejercicioOptionsEdicion = useMemo(
    () =>
      ejerciciosFiltradosEdicion.map((ejercicio) => ({
        value: String(ejercicio.id_ejercicio),
        label: ejercicio.nombre,
        description: ejercicio.tipo || undefined,
      })),
    [ejerciciosFiltradosEdicion]
  )

  const totalSeries = entrenamientoActivo?.series?.length ?? 0
  const seriesTrabajo =
    entrenamientoActivo?.series?.filter((serie) => !serie.es_calentamiento).length ?? 0
  const seriesCalentamiento = totalSeries - seriesTrabajo

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
      <section className="rounded-[1.5rem] bg-[color:var(--surface-low)] p-4 sm:rounded-[1.75rem] sm:p-6">
        <div className="rounded-[1.25rem] bg-[color:var(--surface-lowest)] p-5 shadow-[var(--shadow-airy)] sm:rounded-[1.5rem] sm:p-6">
          <p className="font-label text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.72rem] sm:tracking-[0.24em]">
            Sin sesion activa
          </p>
          <h2 className="mt-2 text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground sm:mt-3 sm:text-3xl sm:tracking-[-0.03em]">
            Todavia no hay un entrenamiento en curso.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Primero abre tu entrenamiento y luego vuelve aqui para empezar a registrar tus series.
          </p>
          <Button
            asChild
            className="mt-5 bg-[color:var(--module-entrenamientos)] text-[color:var(--tertiary-foreground)] hover:bg-[color:var(--module-entrenamientos)]/90"
          >
            <Link href="/app/entrenamientos/registrar">
              Registrar entrenamiento
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="grid gap-4 sm:gap-6 xl:grid-cols-[1.08fr_0.92fr]">
      <section className="order-2 rounded-[1.5rem] bg-[color:var(--surface-low)] p-4 sm:rounded-[1.75rem] sm:p-6 xl:order-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-label text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.7rem] sm:tracking-[0.22em]">
              Sesion actual
            </p>
            <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-foreground sm:mt-2 sm:text-2xl">
              Series registradas
            </h2>
            {entrenamientoActivo.nombre_gimnasio ? (
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {entrenamientoActivo.nombre_gimnasio}
              </p>
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] sm:px-3 sm:tracking-[0.18em]"
              style={{
                background: "color-mix(in oklch, var(--module-entrenamientos) 10%, transparent)",
                color: "var(--module-entrenamientos)",
              }}
            >
              {totalSeries} serie{totalSeries === 1 ? "" : "s"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCloseDialogOpen(true)}
              disabled={submitting}
              className="text-foreground hover:text-primary"
            >
              {submitting ? "Cerrando..." : "Cerrar"}
            </Button>
          </div>
        </div>

        {totalSeries > 0 ? (
          <div className="mt-4 space-y-2 rounded-[1rem] bg-[color:var(--surface-lowest)] p-3 sm:mt-5 sm:rounded-[1.25rem] sm:p-4">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground sm:text-xs">
              <span className="font-label uppercase tracking-[0.18em]">Reparto</span>
              <span>
                {seriesTrabajo} trabajo · {seriesCalentamiento} calentamiento
              </span>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-[color:var(--surface-variant)]">
              {seriesTrabajo > 0 ? (
                <div
                  className="h-full"
                  style={{
                    width: `${(seriesTrabajo / totalSeries) * 100}%`,
                    background: "var(--module-entrenamientos)",
                  }}
                />
              ) : null}
              {seriesCalentamiento > 0 ? (
                <div
                  className="h-full"
                  style={{
                    width: `${(seriesCalentamiento / totalSeries) * 100}%`,
                    background: "color-mix(in oklch, var(--module-entrenamientos) 35%, transparent)",
                  }}
                />
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
          {entrenamientoActivo.series?.length ? (
            entrenamientoActivo.series.map((serie) => (
              <article
                key={serie.id_fuerza_detalle}
                className="rounded-[1.25rem] bg-[color:var(--surface-lowest)] p-4 shadow-[var(--shadow-airy)] sm:rounded-[1.5rem] sm:p-5"
              >
                {editingId === serie.id_fuerza_detalle ? (
                  <div className="space-y-4 sm:space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                      <FieldGroup label="Musculo">
                        <SearchableCombobox
                          value={editingForm.tipo}
                          onChange={(value) =>
                            setEditingForm((prev) => ({
                              ...prev,
                              tipo: value,
                              id_ejercicio: "",
                            }))
                          }
                          options={tipoMuscularOptions}
                          placeholder="Selecciona un grupo muscular"
                          searchPlaceholder="Buscar grupo muscular..."
                          emptyMessage="No hay grupos musculares"
                          loading={loading && tipoMuscularOptions.length === 0}
                          loadingMessage="Cargando grupos..."
                        />
                      </FieldGroup>

                      <FieldGroup label="Ejercicio">
                        <SearchableCombobox
                          value={editingForm.id_ejercicio}
                          onChange={(value) =>
                            setEditingForm((prev) => ({ ...prev, id_ejercicio: value }))
                          }
                          options={ejercicioOptionsEdicion}
                          placeholder="Mantener ejercicio actual"
                          searchPlaceholder="Buscar ejercicio..."
                          emptyMessage="No hay ejercicios para este grupo"
                          disabled={submitting || !editingForm.tipo}
                          disabledMessage="Primero elige un grupo"
                          loading={loading && ejercicioOptionsEdicion.length === 0}
                          loadingMessage="Cargando ejercicios..."
                        />
                      </FieldGroup>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
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

                    <div className="flex flex-wrap gap-2 sm:gap-3">
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
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-[0.18em]">
                            {serie.tipo_ejercicio ?? "sin grupo"}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] sm:text-[11px] sm:tracking-[0.18em] ${
                              serie.es_calentamiento
                                ? "bg-primary/10 text-primary"
                                : "bg-foreground/5 text-foreground"
                            }`}
                          >
                            {serie.es_calentamiento ? "calentamiento" : "trabajo"}
                          </span>
                        </div>
                        <p className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                          {serie.nombre_ejercicio ?? `Serie #${serie.id_fuerza_detalle}`}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                          {serie.cantidad_peso} <span className="text-sm text-muted-foreground">kg</span>
                        </p>
                        <p className="text-xs text-muted-foreground sm:text-sm">
                          {serie.repeticiones} reps
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingId(serie.id_fuerza_detalle)
                          setEditingForm(getEditableForm(serie))
                        }}
                        className="text-foreground hover:text-primary"
                      >
                        <PencilLine className="size-3.5" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(serie.id_fuerza_detalle)}
                        className="text-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="rounded-[1.25rem] bg-[color:var(--surface-lowest)] p-5 text-sm leading-6 text-muted-foreground shadow-[var(--shadow-airy)] sm:rounded-[1.5rem] sm:p-6">
              Aun no registras series en esta sesion. Agrega la primera desde el panel {""}
              <span className="sm:hidden">de arriba</span>
              <span className="hidden sm:inline">lateral</span>
              {" "}y aparecera aqui al instante.
            </div>
          )}
        </div>
      </section>

      <div className="order-1 space-y-4 sm:space-y-6 xl:order-none">
        <FormPanel eyebrow="Nueva serie" accent="tertiary">
          <form onSubmit={handleCreate} className="space-y-4 sm:space-y-5">
            <div className="grid gap-4 sm:gap-5">
              <FieldGroup label="Grupo muscular">
                <SearchableCombobox
                  value={form.tipo}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      tipo: value,
                      id_ejercicio: "",
                    }))
                  }
                  options={tipoMuscularOptions}
                  disabled={submitting || loading}
                  placeholder="Selecciona un grupo muscular"
                  searchPlaceholder="Buscar grupo muscular..."
                  emptyMessage="No hay grupos musculares"
                  loading={loading && tipoMuscularOptions.length === 0}
                  loadingMessage="Cargando grupos..."
                />
              </FieldGroup>

              <FieldGroup label="Ejercicio" hint={form.tipo ? "Disponibles para el grupo" : ""}>
                <SearchableCombobox
                  value={form.id_ejercicio}
                  onChange={(value) => setForm((prev) => ({ ...prev, id_ejercicio: value }))}
                  options={ejercicioOptions}
                  disabled={submitting || !form.tipo}
                  disabledMessage="Primero elige un grupo"
                  placeholder={form.tipo ? "Selecciona un ejercicio" : "Primero elige un grupo"}
                  searchPlaceholder="Buscar ejercicio..."
                  emptyMessage="No hay ejercicios para este grupo"
                  loading={loading && ejercicioOptions.length === 0}
                  loadingMessage="Cargando ejercicios..."
                />
              </FieldGroup>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
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

            <label
              className="flex items-center gap-3 rounded-[1rem] px-4 py-3 text-sm text-foreground"
              style={{ background: "color-mix(in oklch, var(--module-entrenamientos) 8%, transparent)" }}
            >
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

            <FormNote>
              Esta sesion se esta registrando en{" "}
              <span className="font-medium text-foreground">
                {entrenamientoActivo.nombre_gimnasio ?? "tu gimnasio actual"}
              </span>
              .
            </FormNote>

            <Button
              type="submit"
              disabled={submitting || !form.id_ejercicio}
              className="w-full bg-[color:var(--module-entrenamientos)] text-[color:var(--tertiary-foreground)] hover:bg-[color:var(--module-entrenamientos)]/90 sm:w-auto"
            >
              <Plus className="size-4" />
              {submitting ? "Guardando..." : "Agregar serie"}
            </Button>
          </form>
        </FormPanel>
      </div>

      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent className="max-w-xl rounded-[1.5rem] border-0 bg-[color:var(--surface-lowest)] p-0 shadow-[var(--shadow-airy-lg)] sm:rounded-[1.75rem]">
          <div className="bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_14%,white),transparent_70%)] px-5 py-5 sm:px-7 sm:py-6">
            <DialogHeader className="text-left">
              <p className="font-label text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.72rem] sm:tracking-[0.24em]">
                Confirmacion
              </p>
              <DialogTitle className="mt-2 text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl sm:tracking-[-0.03em]">
                Estas seguro de cerrar el entrenamiento?
              </DialogTitle>
              <DialogDescription className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground sm:mt-3">
                Si cierras la sesion ahora, este entrenamiento pasara al historico y dejaras de registrar series en curso.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-5 pb-5 sm:px-7 sm:pb-6">
            <div className="rounded-[1.25rem] bg-[color:var(--surface-low)] p-4 sm:rounded-[1.5rem] sm:p-5">
              <p className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {entrenamientoActivo.nombre_gimnasio ?? "Entrenamiento actual"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {totalSeries} serie{totalSeries === 1 ? "" : "s"} registradas en esta sesion.
              </p>
            </div>

            <DialogFooter className="mt-4 sm:mt-5">
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
