"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEntrenamientos } from "@/modules/entrenamientos/hooks/useEntrenamientos"

export function HistoricoFuerza() {
  const { entrenamientosFuerza, fetchDetalleEntrenoFuerza, loading } = useEntrenamientos()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof fetchDetalleEntrenoFuerza>> | null>(null)

  const handleSelect = async (idEntrenamientoFuerza: number) => {
    const data = await fetchDetalleEntrenoFuerza(idEntrenamientoFuerza)
    setSelectedId(idEntrenamientoFuerza)
    setDetail(data)
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Historico de fuerza</CardTitle>
          <CardDescription>Todas las sesiones de entrenamiento registradas por el usuario.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:hidden">
            {entrenamientosFuerza.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay entrenamientos de fuerza registrados.</p>
            ) : null}

            {entrenamientosFuerza.map((entreno) => (
              <div key={entreno.id_entrenamiento_fuerza} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{entreno.nombre_gimnasio ?? "Sin gimnasio"}</p>
                  <p className="text-xs text-muted-foreground">{entreno.estado}</p>
                </div>
                <p className="text-sm text-muted-foreground">{entreno.inicio_at}</p>
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={() => void handleSelect(entreno.id_entrenamiento_fuerza)}
                >
                  Ver detalle
                </Button>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Gimnasio</TableHead>
                  <TableHead>Comuna</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {entrenamientosFuerza.map((entreno) => (
                  <TableRow key={entreno.id_entrenamiento_fuerza}>
                    <TableCell>{entreno.id_entrenamiento_fuerza}</TableCell>
                    <TableCell>{entreno.inicio_at}</TableCell>
                    <TableCell>{entreno.estado}</TableCell>
                    <TableCell>{entreno.nombre_gimnasio ?? "-"}</TableCell>
                    <TableCell>{entreno.comuna ?? "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" onClick={() => void handleSelect(entreno.id_entrenamiento_fuerza)}>
                        Ver detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalle del entrenamiento</CardTitle>
          <CardDescription>
            {selectedId ? `Sesion #${selectedId}` : "Selecciona una sesion para revisar sus series."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && !detail ? <p className="text-sm text-muted-foreground">Cargando detalle...</p> : null}

          {detail ? (
            <>
              <div className="rounded-lg border p-3">
                <p className="font-medium">{detail.nombre_gimnasio ?? "Sin gimnasio"}</p>
                <p className="text-sm text-muted-foreground">
                  {detail.nombre_cadena ?? "Sin cadena"} · {detail.comuna ?? "Sin comuna"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Inicio: {detail.inicio_at} · Fin: {detail.fin_at ?? "En curso"}
                </p>
              </div>

              <div className="space-y-2">
                {(detail.series ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Esta sesion no tiene series registradas.</p>
                ) : null}

                {(detail.series ?? []).map((serie) => (
                  <div key={serie.id_fuerza_detalle} className="rounded-lg border p-3">
                    <p className="font-medium">{serie.nombre_ejercicio ?? "Ejercicio sin nombre"}</p>
                    <p className="text-sm text-muted-foreground">
                      {serie.repeticiones} reps · {serie.cantidad_peso} kg
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {serie.es_calentamiento ? "Calentamiento" : "Trabajo"} ·{" "}
                      {serie.tipo_ejercicio ?? "Tipo no informado"}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              Aqui veras el detalle y las series del entrenamiento seleccionado.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
