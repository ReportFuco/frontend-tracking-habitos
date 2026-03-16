"use client"

import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useFinanzas } from "@/modules/finanzas/hooks/useFinanzas"
import {
  movimientoCreateSchema,
  TIPOS_GASTO,
  TIPOS_MOVIMIENTO,
} from "@/modules/finanzas/schemas/finanzas.schema"
import { TipoGasto, TipoMovimiento } from "@/modules/finanzas/types/finanzas"

const initialMovimientoForm = {
  id_categoria: "",
  id_cuenta: "",
  tipo_movimiento: "gasto" as TipoMovimiento,
  tipo_gasto: "variable" as TipoGasto,
  monto: "",
  descripcion: "",
}

export function MovimientoFormCard() {
  const {
    categorias,
    cuentas,
    loadingCatalogos,
    submittingMovimiento,
    error,
    crearMovimiento,
  } = useFinanzas()

  const [form, setForm] = useState(initialMovimientoForm)
  const [uiMessage, setUiMessage] = useState<string | null>(null)

  const handleCreateMovimiento = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUiMessage(null)

    const parsed = movimientoCreateSchema.safeParse({
      id_categoria: Number(form.id_categoria),
      id_cuenta: Number(form.id_cuenta),
      tipo_movimiento: form.tipo_movimiento,
      tipo_gasto: form.tipo_gasto,
      monto: Number(form.monto),
      descripcion: form.descripcion,
    })

    if (!parsed.success) {
      setUiMessage(parsed.error.issues[0]?.message ?? "Formulario de movimiento invalido")
      return
    }

    const payload = {
      ...parsed.data,
      descripcion: parsed.data.descripcion || null,
    }

    const result = await crearMovimiento(payload)

    if (result.ok) {
      setForm(initialMovimientoForm)
      setUiMessage("Movimiento creado correctamente")
      return
    }

    setUiMessage(result.message)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Movimiento</CardTitle>
        <CardDescription>Registra ingresos y gastos para una cuenta.</CardDescription>
      </CardHeader>
      <CardContent>
        {(error || uiMessage) && (
          <div className="mb-3 rounded-md border border-amber-500/40 bg-amber-50 p-3 text-sm text-amber-900">
            {uiMessage ?? error}
          </div>
        )}

        <form onSubmit={handleCreateMovimiento} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Categoria</label>
            <select
              className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
              value={form.id_categoria}
              onChange={(event) => setForm((prev) => ({ ...prev, id_categoria: event.target.value }))}
              required
            >
              <option value="">Selecciona una categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Cuenta</label>
            <select
              className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
              value={form.id_cuenta}
              onChange={(event) => setForm((prev) => ({ ...prev, id_cuenta: event.target.value }))}
              required
            >
              <option value="">Selecciona una cuenta</option>
              {cuentas.map((cuenta) => (
                <option key={cuenta.id_cuenta} value={cuenta.id_cuenta}>
                  {cuenta.nombre_cuenta}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Tipo Movimiento</label>
              <select
                className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
                value={form.tipo_movimiento}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, tipo_movimiento: event.target.value as TipoMovimiento }))
                }
              >
                {TIPOS_MOVIMIENTO.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Tipo Gasto</label>
              <select
                className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
                value={form.tipo_gasto}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, tipo_gasto: event.target.value as TipoGasto }))
                }
              >
                {TIPOS_GASTO.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Monto</label>
            <Input
              type="number"
              min={1}
              placeholder="3500"
              value={form.monto}
              onChange={(event) => setForm((prev) => ({ ...prev, monto: event.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Descripcion (opcional)</label>
            <Input
              placeholder="Detalle del movimiento"
              value={form.descripcion}
              onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
            />
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={submittingMovimiento || loadingCatalogos}
          >
            {submittingMovimiento ? "Guardando..." : "Crear movimiento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
