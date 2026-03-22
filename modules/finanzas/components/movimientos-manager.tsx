"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useFinanzas } from "@/modules/finanzas/hooks/useFinanzas"
import { TIPOS_GASTO, TIPOS_MOVIMIENTO } from "@/modules/finanzas/schemas/finanzas.schema"
import { TipoGasto, TipoMovimiento } from "@/modules/finanzas/types/finanzas"

export function MovimientosManager() {
  const { categorias, cuentas, movimientos, editarMovimiento } = useFinanzas()

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimientos</CardTitle>
        <CardDescription>
          Puedes editar movimientos existentes. En tu API actual no aparece endpoint delete para movimientos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {movimientos.map((movimiento) => (
            <div key={movimiento.id_transaccion} className="rounded-md border p-3">
              {editingId === movimiento.id_transaccion ? (
                <div className="space-y-2">
                  <select
                    className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
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
                    className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
                    value={idCuenta}
                    onChange={(event) => setIdCuenta(event.target.value)}
                  >
                    {cuentas.map((cuenta) => (
                      <option key={cuenta.id_cuenta} value={cuenta.id_cuenta}>
                        {cuenta.nombre_cuenta}
                      </option>
                    ))}
                  </select>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <select
                      className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
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
                      className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
                      value={tipoGasto}
                      onChange={(event) => setTipoGasto(event.target.value as TipoGasto)}
                    >
                      {TIPOS_GASTO.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input type="number" min={1} value={monto} onChange={(event) => setMonto(event.target.value)} />

                  <div className="flex gap-2">
                    <Button onClick={() => onSave(movimiento.id_transaccion)}>Guardar</Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium capitalize">{movimiento.tipo_movimiento}</p>
                    <p className="text-sm text-muted-foreground">
                      {movimiento.categoria ?? "-"} | {movimiento.nombre_cuenta ?? "-"}
                    </p>
                    <p className="text-sm font-semibold">${movimiento.monto}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingId(movimiento.id_transaccion)
                      const categoria = categorias.find((item) => item.nombre === movimiento.categoria)
                      const cuenta = cuentas.find((item) => item.nombre_cuenta === movimiento.nombre_cuenta)

                      setIdCategoria(String(categoria?.id_categoria ?? categorias[0]?.id_categoria ?? ""))
                      setIdCuenta(String(cuenta?.id_cuenta ?? cuentas[0]?.id_cuenta ?? ""))
                      setTipoMovimiento(movimiento.tipo_movimiento)
                      setTipoGasto(movimiento.tipo_gasto)
                      setMonto(String(movimiento.monto))
                    }}
                  >
                    Editar
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
