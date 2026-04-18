"use client"

import { useState } from "react"
import { ArrowUpRight, Landmark, PencilLine, Wallet } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useFinanzas } from "@/modules/finanzas/hooks/useFinanzas"
import { TIPOS_GASTO, TIPOS_MOVIMIENTO } from "@/modules/finanzas/schemas/finanzas.schema"
import { TipoGasto, TipoMovimiento } from "@/modules/finanzas/types/finanzas"

export function MovimientosManager() {
  const { categorias, cuentas, movimientos, editarMovimiento, loadingCatalogos } = useFinanzas()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [idCategoria, setIdCategoria] = useState("")
  const [idCuenta, setIdCuenta] = useState("")
  const [tipoMovimiento, setTipoMovimiento] = useState<TipoMovimiento>("gasto")
  const [tipoGasto, setTipoGasto] = useState<TipoGasto>("variable")
  const [monto, setMonto] = useState("")

  const onSave = async (idMovimiento: number) => {
    const result = await editarMovimiento(idMovimiento, {
      id_categoria: Number(idCategoria),
      id_cuenta: Number(idCuenta),
      tipo_movimiento: tipoMovimiento,
      tipo_gasto: tipoGasto,
      monto: Number(monto),
    })

    if (result.ok) {
      toast.success("Movimiento actualizado", {
        description: "Los cambios del movimiento se guardaron correctamente.",
      })
      setEditingId(null)
      return
    }

    toast.error("No pudimos actualizar el movimiento", {
      description: result.message,
    })
  }

  const totalIngresos = movimientos
    .filter((movimiento) => movimiento.tipo_movimiento === "ingreso")
    .reduce((acc, movimiento) => acc + movimiento.monto, 0)

  const totalGastos = movimientos
    .filter((movimiento) => movimiento.tipo_movimiento === "gasto")
    .reduce((acc, movimiento) => acc + movimiento.monto, 0)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(value)

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

  const startEditing = (idTransaccion: number, categoriaNombre?: string | null, cuentaNombre?: string | null, movimientoTipo?: TipoMovimiento, gastoTipo?: TipoGasto, movimientoMonto?: number) => {
    const categoria = categorias.find((item) => item.nombre === categoriaNombre)
    const cuenta = cuentas.find((item) => item.nombre_cuenta === cuentaNombre)

    setEditingId(idTransaccion)
    setIdCategoria(String(categoria?.id_categoria ?? categorias[0]?.id_categoria ?? ""))
    setIdCuenta(String(cuenta?.id_cuenta ?? cuentas[0]?.id_cuenta ?? ""))
    setTipoMovimiento(movimientoTipo ?? "gasto")
    setTipoGasto(gastoTipo ?? "variable")
    setMonto(String(movimientoMonto ?? ""))
  }

  const renderEditFields = (idMovimiento: number) => (
    <div className="space-y-3 rounded-[1.25rem] bg-[color:var(--surface-low)] p-4">
      <div className="grid gap-3 lg:grid-cols-2">
        <select
          className="h-11 w-full rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 text-sm outline-none"
          value={idCategoria}
          onChange={(event) => setIdCategoria(event.target.value)}
        >
          {categorias.map((categoria) => (
            <option key={categoria.id_categoria} value={categoria.id_categoria}>
              {categoria.nombre}
            </option>
          ))}
        </select>

        <select
          className="h-11 w-full rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 text-sm outline-none"
          value={idCuenta}
          onChange={(event) => setIdCuenta(event.target.value)}
        >
          {cuentas.map((cuenta) => (
            <option key={cuenta.id_cuenta} value={cuenta.id_cuenta}>
              {cuenta.nombre_cuenta}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <select
          className="h-11 w-full rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 text-sm outline-none"
          value={tipoMovimiento}
          onChange={(event) => setTipoMovimiento(event.target.value as TipoMovimiento)}
        >
          {TIPOS_MOVIMIENTO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        <select
          className="h-11 w-full rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 text-sm outline-none"
          value={tipoGasto}
          onChange={(event) => setTipoGasto(event.target.value as TipoGasto)}
        >
          {TIPOS_GASTO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        <Input
          type="number"
          min={1}
          value={monto}
          onChange={(event) => setMonto(event.target.value)}
          className="h-11 rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 shadow-none focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => onSave(idMovimiento)} className="rounded-xl">
          Guardar cambios
        </Button>
        <Button variant="ghost" onClick={() => setEditingId(null)} className="rounded-xl">
          Cancelar
        </Button>
      </div>
    </div>
  )

  return (
    <section className="flex flex-col gap-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
        <article className="rounded-[1.75rem] bg-[color:var(--surface-low)] p-6">
          <p className="font-label text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
            Diario financiero
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground">
            Tus movimientos toman el protagonismo aqui.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Esta vista se concentra en revisar, leer y ajustar movimientos existentes. El registro de nuevos gastos o ingresos queda en su flujo dedicado.
          </p>
        </article>

        <article className="rounded-[1.75rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)]">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ArrowUpRight className="size-4 text-[color:var(--module-finanzas)]" />
            Ingresos
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(totalIngresos)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Total acumulado de movimientos marcados como ingreso.
          </p>
        </article>

        <article className="rounded-[1.75rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)]">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Wallet className="size-4 text-[color:var(--module-finanzas)]" />
            Gastos
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(totalGastos)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Total acumulado de movimientos marcados como gasto.
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
              Movimientos recientes
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            En desktop se muestran como tabla. En pantallas pequenas, como cards editoriales.
          </p>
        </div>

        {loadingCatalogos ? (
          <div className="mt-6 rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 text-sm text-muted-foreground shadow-[var(--shadow-airy)]">
            Cargando movimientos...
          </div>
        ) : movimientos.length === 0 ? (
          <div className="mt-6 rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 text-sm leading-6 text-muted-foreground shadow-[var(--shadow-airy)]">
            Aun no tienes movimientos registrados. Usa el flujo de <span className="font-medium text-foreground">Registrar movimientos</span> para comenzar a construir tu diario financiero.
          </div>
        ) : (
          <>
            <div className="mt-6 hidden overflow-hidden rounded-[1.5rem] bg-[color:var(--surface-lowest)] shadow-[var(--shadow-airy)] lg:block">
              <Table>
                <TableHeader className="bg-[color:var(--surface-low)]">
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableHead className="px-5 py-4">Movimiento</TableHead>
                    <TableHead className="px-5 py-4">Categoria</TableHead>
                    <TableHead className="px-5 py-4">Cuenta</TableHead>
                    <TableHead className="px-5 py-4">Fecha</TableHead>
                    <TableHead className="px-5 py-4 text-right">Monto</TableHead>
                    <TableHead className="px-5 py-4 text-right">Accion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientos.map((movimiento) => (
                    <TableRow key={movimiento.id_transaccion} className="border-0 hover:bg-[color:var(--surface-low)]/70">
                      <TableCell className="px-5 py-4 align-top">
                        {editingId === movimiento.id_transaccion ? (
                          renderEditFields(movimiento.id_transaccion)
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
                                  movimiento.tipo_movimiento === "ingreso"
                                    ? "bg-secondary/12 text-secondary"
                                    : "bg-primary/12 text-primary"
                                )}
                              >
                                {movimiento.tipo_movimiento}
                              </span>
                              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                {movimiento.tipo_gasto}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {movimiento.descripcion || "Sin descripcion"}
                            </p>
                          </div>
                        )}
                      </TableCell>
                      {editingId === movimiento.id_transaccion ? (
                        <TableCell colSpan={5} className="px-5 py-4" />
                      ) : (
                        <>
                          <TableCell className="px-5 py-4">{movimiento.categoria ?? "-"}</TableCell>
                          <TableCell className="px-5 py-4">{movimiento.nombre_cuenta ?? "-"}</TableCell>
                          <TableCell className="px-5 py-4 text-sm text-muted-foreground">
                            {formatDate(movimiento.created_at)}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-right font-semibold">
                            {formatCurrency(movimiento.monto)}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-right">
                            <Button
                              variant="ghost"
                              className="rounded-full"
                              onClick={() =>
                                startEditing(
                                  movimiento.id_transaccion,
                                  movimiento.categoria,
                                  movimiento.nombre_cuenta,
                                  movimiento.tipo_movimiento,
                                  movimiento.tipo_gasto,
                                  movimiento.monto
                                )
                              }
                            >
                              <PencilLine className="size-4" />
                              Editar
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 grid gap-4 lg:hidden">
              {movimientos.map((movimiento) => (
                <article
                  key={movimiento.id_transaccion}
                  className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-5 shadow-[var(--shadow-airy)]"
                >
                  {editingId === movimiento.id_transaccion ? (
                    renderEditFields(movimiento.id_transaccion)
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
                                movimiento.tipo_movimiento === "ingreso"
                                  ? "bg-secondary/12 text-secondary"
                                  : "bg-primary/12 text-primary"
                              )}
                            >
                              {movimiento.tipo_movimiento}
                            </span>
                            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              {movimiento.tipo_gasto}
                            </span>
                          </div>
                          <p className="text-lg font-semibold tracking-tight text-foreground">
                            {formatCurrency(movimiento.monto)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          className="rounded-full"
                          onClick={() =>
                            startEditing(
                              movimiento.id_transaccion,
                              movimiento.categoria,
                              movimiento.nombre_cuenta,
                              movimiento.tipo_movimiento,
                              movimiento.tipo_gasto,
                              movimiento.monto
                            )
                          }
                        >
                          <PencilLine className="size-4" />
                        </Button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.25rem] bg-[color:var(--surface-low)] p-4">
                          <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                            Categoria
                          </p>
                          <p className="mt-2 text-sm text-foreground">{movimiento.categoria ?? "-"}</p>
                        </div>
                        <div className="rounded-[1.25rem] bg-[color:var(--surface-low)] p-4">
                          <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                            Cuenta
                          </p>
                          <p className="mt-2 flex items-center gap-2 text-sm text-foreground">
                            <Landmark className="size-4 text-[color:var(--module-finanzas)]" />
                            {movimiento.nombre_cuenta ?? "-"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>{movimiento.descripcion || "Sin descripcion"}</p>
                        <p>{formatDate(movimiento.created_at)}</p>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </section>
  )
}
