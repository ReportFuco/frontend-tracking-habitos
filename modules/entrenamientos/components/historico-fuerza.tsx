"use client"

import { useState } from "react"
import { Flame, TableProperties } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useEntrenamientos } from "@/modules/entrenamientos/hooks/useEntrenamientos"

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return value
  }
}

export function HistoricoFuerza() {
  const { entrenamientosFuerza, fetchDetalleEntrenoFuerza, loading } = useEntrenamientos()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof fetchDetalleEntrenoFuerza>> | null>(null)

  const sesionesCerradas = entrenamientosFuerza.filter((entreno) => entreno.estado !== "activo")
  const totalSeries = sesionesCerradas.reduce(
    (acc, entrenamiento) => acc + (detail?.id_entrenamiento_fuerza === entrenamiento.id_entrenamiento_fuerza ? detail.series?.length ?? 0 : 0),
    0
  )

  const handleSelect = async (idEntrenamientoFuerza: number) => {
    const data = await fetchDetalleEntrenoFuerza(idEntrenamientoFuerza)
    setSelectedId(idEntrenamientoFuerza)
    setDetail(data)
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <article className="rounded-[1.75rem] bg-[color:var(--surface-low)] p-6">
            <p className="font-label text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
              Diario de sesiones
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground">
              Tus entrenamientos anteriores toman el protagonismo aqui.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Esta vista se dedica a revisar sesiones ya registradas, sin mezclar el registro activo ni el formulario para abrir una nueva.
            </p>
          </article>

          <article className="rounded-[1.75rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)]">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Flame className="size-4 text-[color:var(--module-entrenamientos)]" />
              Sesiones
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {sesionesCerradas.length}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Registros anteriores disponibles para consulta.
            </p>
          </article>

          <article className="rounded-[1.75rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)]">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <TableProperties className="size-4 text-[color:var(--module-entrenamientos)]" />
              Series visibles
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{totalSeries}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Series mostradas del entrenamiento actualmente seleccionado.
            </p>
          </article>
        </section>

        <section className="rounded-[1.75rem] bg-[color:var(--surface-low)] p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-label text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
                Registro actual
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                Sesiones cerradas
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Tabla en desktop y cards editoriales en mobile.
            </p>
          </div>

          {loading && !detail && sesionesCerradas.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 text-sm text-muted-foreground shadow-[var(--shadow-airy)]">
              Cargando entrenamientos...
            </div>
          ) : sesionesCerradas.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 text-sm leading-6 text-muted-foreground shadow-[var(--shadow-airy)]">
              Todavia no tienes entrenamientos anteriores. Cuando cierres una sesion activa, aparecera aqui.
            </div>
          ) : (
            <>
              <div className="mt-6 hidden overflow-hidden rounded-[1.5rem] bg-[color:var(--surface-low)] shadow-[0_8px_48px_-12px_rgba(0,0,0,0.05)] lg:block">
                <Table>
                  <TableHeader className="bg-[color:var(--module-entrenamientos)] text-[color:var(--tertiary-foreground)]">
                    <TableRow className="border-0 hover:bg-transparent">
                      <TableHead className="px-8 py-5 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--tertiary-foreground)]">
                        Sesion
                      </TableHead>
                      <TableHead className="px-6 py-5 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--tertiary-foreground)]">
                        Gimnasio
                      </TableHead>
                      <TableHead className="px-6 py-5 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--tertiary-foreground)]">
                        Estado
                      </TableHead>
                      <TableHead className="px-6 py-5 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--tertiary-foreground)]">
                        Cierre
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="[&_tr:not(:last-child)]:border-b [&_tr:not(:last-child)]:border-[color:var(--border)]/30">
                    {sesionesCerradas.map((entreno, index) => (
                      <TableRow
                        key={entreno.id_entrenamiento_fuerza}
                        role="button"
                        tabIndex={0}
                        className={cn(
                          "cursor-pointer border-0 transition-colors hover:bg-tertiary/8 focus-visible:bg-tertiary/8",
                          index % 2 === 0
                            ? "bg-[color:var(--surface-lowest)]"
                            : "bg-[color:var(--surface-low)]"
                        )}
                        onClick={() => void handleSelect(entreno.id_entrenamiento_fuerza)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            void handleSelect(entreno.id_entrenamiento_fuerza)
                          }
                        }}
                      >
                        <TableCell className="px-8 py-5 align-top">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              Sesion #{entreno.id_entrenamiento_fuerza}
                            </p>
                            <p className="text-sm text-muted-foreground">{formatDate(entreno.inicio_at)}</p>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div>
                            <p className="text-foreground">{entreno.nombre_gimnasio ?? "Sin gimnasio"}</p>
                            <p className="text-sm text-muted-foreground">{entreno.comuna ?? "-"}</p>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-tertiary/12 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-tertiary">
                            {entreno.estado}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-5 text-sm text-muted-foreground">
                          {entreno.fin_at ? formatDate(entreno.fin_at) : "Sin cierre"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 grid gap-4 lg:hidden">
                {sesionesCerradas.map((entreno) => (
                  <article
                    key={entreno.id_entrenamiento_fuerza}
                    className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-5 shadow-[var(--shadow-airy)]"
                    role="button"
                    tabIndex={0}
                    onClick={() => void handleSelect(entreno.id_entrenamiento_fuerza)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        void handleSelect(entreno.id_entrenamiento_fuerza)
                      }
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold tracking-tight text-foreground">
                            {entreno.nombre_gimnasio ?? "Sin gimnasio"}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatDate(entreno.inicio_at)}
                          </p>
                        </div>
                        <span className="inline-flex rounded-full bg-tertiary/12 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-tertiary">
                          {entreno.estado}
                        </span>
                      </div>

                      <div className="rounded-[1.25rem] bg-[color:var(--surface-low)] p-4">
                        <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                          Cierre
                        </p>
                        <p className="mt-2 text-sm text-foreground">
                          {entreno.fin_at ? formatDate(entreno.fin_at) : "Sin cierre"}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <section className="rounded-[1.75rem] bg-[color:var(--surface-low)] p-6">
        <div>
          <p className="font-label text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
            Detalle
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Sesion seleccionada
          </h3>
        </div>

        <div className="mt-6">
          {loading && !detail ? (
            <div className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 text-sm text-muted-foreground shadow-[var(--shadow-airy)]">
              Cargando detalle...
            </div>
          ) : detail ? (
            <div className="space-y-4">
              <article className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-5 shadow-[var(--shadow-airy)]">
                <div className="space-y-2">
                  <span className="inline-flex rounded-full bg-tertiary/12 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-tertiary">
                    Sesion #{selectedId}
                  </span>
                  <h4 className="text-xl font-semibold tracking-tight text-foreground">
                    {detail.nombre_gimnasio ?? "Sin gimnasio"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {detail.nombre_cadena ?? "Cadena no informada"} · {detail.comuna ?? "Sin comuna"}
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.25rem] bg-[color:var(--surface-low)] p-4">
                    <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                      Inicio
                    </p>
                    <p className="mt-2 text-sm text-foreground">{formatDate(detail.inicio_at)}</p>
                  </div>
                  <div className="rounded-[1.25rem] bg-[color:var(--surface-low)] p-4">
                    <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                      Cierre
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      {detail.fin_at ? formatDate(detail.fin_at) : "Sin cierre"}
                    </p>
                  </div>
                </div>
              </article>

              <div className="space-y-3">
                {(detail.series ?? []).length === 0 ? (
                  <div className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 text-sm leading-6 text-muted-foreground shadow-[var(--shadow-airy)]">
                    Esta sesion no tiene series registradas.
                  </div>
                ) : (
                  (detail.series ?? []).map((serie) => (
                    <article
                      key={serie.id_fuerza_detalle}
                      className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-5 shadow-[var(--shadow-airy)]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
                                serie.es_calentamiento
                                  ? "bg-tertiary/12 text-tertiary"
                                  : "bg-[color:var(--surface-low)] text-foreground"
                              )}
                            >
                              {serie.es_calentamiento ? "calentamiento" : "trabajo"}
                            </span>
                            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              {serie.tipo_ejercicio ?? "tipo no informado"}
                            </span>
                          </div>
                          <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">
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
                    </article>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 text-sm leading-6 text-muted-foreground shadow-[var(--shadow-airy)]">
              Selecciona una sesion del listado para revisar su detalle y las series asociadas.
            </div>
          )}
        </div>
      </section>
    </section>
  )
}
