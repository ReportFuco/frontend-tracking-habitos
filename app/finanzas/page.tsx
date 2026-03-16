"use client"

import { FormEvent, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useFinanzas } from "@/modules/finanzas/hooks/useFinanzas"
import {
  cuentaCreateSchema,
  movimientoCreateSchema,
  TIPOS_CUENTA,
  TIPOS_GASTO,
  TIPOS_MOVIMIENTO,
} from "@/modules/finanzas/schemas/finanzas.schema"
import { TipoCuenta, TipoGasto, TipoMovimiento } from "@/modules/finanzas/types/finanzas"

const initialCuentaForm = {
  id_banco: "",
  nombre_cuenta: "",
  tipo_cuenta: "Cuenta Corriente" as TipoCuenta,
}

const initialMovimientoForm = {
  id_categoria: "",
  id_cuenta: "",
  tipo_movimiento: "gasto" as TipoMovimiento,
  tipo_gasto: "variable" as TipoGasto,
  monto: "",
  descripcion: "",
}

export default function FinanzasPage() {
  const {
    bancos,
    categorias,
    cuentas,
    movimientos,
    loadingCatalogos,
    submittingCuenta,
    submittingMovimiento,
    error,
    crearCuenta,
    crearMovimiento,
  } = useFinanzas()

  const [cuentaForm, setCuentaForm] = useState(initialCuentaForm)
  const [movimientoForm, setMovimientoForm] = useState(initialMovimientoForm)
  const [uiMessage, setUiMessage] = useState<string | null>(null)

  const movimientosRecientes = useMemo(() => movimientos.slice(0, 10), [movimientos])

  const handleCreateCuenta = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = cuentaCreateSchema.safeParse({
      id_banco: Number(cuentaForm.id_banco),
      nombre_cuenta: cuentaForm.nombre_cuenta,
      tipo_cuenta: cuentaForm.tipo_cuenta,
    })

    if (!parsed.success) {
      setUiMessage(parsed.error.issues[0]?.message ?? "Formulario de cuenta invalido")
      return
    }

    const result = await crearCuenta(parsed.data)

    if (result.ok) {
      setCuentaForm(initialCuentaForm)
      setUiMessage("Cuenta creada correctamente")
      return
    }

    setUiMessage(result.message)
  }

  const handleCreateMovimiento = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = movimientoCreateSchema.safeParse({
      id_categoria: Number(movimientoForm.id_categoria),
      id_cuenta: Number(movimientoForm.id_cuenta),
      tipo_movimiento: movimientoForm.tipo_movimiento,
      tipo_gasto: movimientoForm.tipo_gasto,
      monto: Number(movimientoForm.monto),
      descripcion: movimientoForm.descripcion,
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
      setMovimientoForm(initialMovimientoForm)
      setUiMessage("Movimiento creado correctamente")
      return
    }

    setUiMessage(result.message)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Finanzas</h1>
        <p className="text-sm text-muted-foreground">
          Conexion inicial con API para crear cuentas y movimientos.
        </p>
      </div>

      {(error || uiMessage) && (
        <div className="rounded-md border border-amber-500/40 bg-amber-50 p-3 text-sm text-amber-900">
          {uiMessage ?? error}
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crear Cuenta</CardTitle>
            <CardDescription>Registra una cuenta bancaria para operar movimientos.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCuenta} className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Banco</label>
                <select
                  className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
                  value={cuentaForm.id_banco}
                  onChange={(event) =>
                    setCuentaForm((prev) => ({ ...prev, id_banco: event.target.value }))
                  }
                  required
                >
                  <option value="">Selecciona un banco</option>
                  {bancos.map((banco) => (
                    <option key={banco.id_banco} value={banco.id_banco}>
                      {banco.nombre_banco}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Nombre de Cuenta</label>
                <Input
                  placeholder="Ej: Cuenta principal"
                  value={cuentaForm.nombre_cuenta}
                  onChange={(event) =>
                    setCuentaForm((prev) => ({ ...prev, nombre_cuenta: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Tipo de Cuenta</label>
                <select
                  className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
                  value={cuentaForm.tipo_cuenta}
                  onChange={(event) =>
                    setCuentaForm((prev) => ({ ...prev, tipo_cuenta: event.target.value as TipoCuenta }))
                  }
                >
                  {TIPOS_CUENTA.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={submittingCuenta || loadingCatalogos}
              >
                {submittingCuenta ? "Guardando..." : "Crear cuenta"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crear Movimiento</CardTitle>
            <CardDescription>Registra ingresos y gastos vinculados a una cuenta.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateMovimiento} className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Categoria</label>
                <select
                  className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
                  value={movimientoForm.id_categoria}
                  onChange={(event) =>
                    setMovimientoForm((prev) => ({ ...prev, id_categoria: event.target.value }))
                  }
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
                  value={movimientoForm.id_cuenta}
                  onChange={(event) =>
                    setMovimientoForm((prev) => ({ ...prev, id_cuenta: event.target.value }))
                  }
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
                    value={movimientoForm.tipo_movimiento}
                    onChange={(event) =>
                      setMovimientoForm((prev) => ({
                        ...prev,
                        tipo_movimiento: event.target.value as TipoMovimiento,
                      }))
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
                    value={movimientoForm.tipo_gasto}
                    onChange={(event) =>
                      setMovimientoForm((prev) => ({
                        ...prev,
                        tipo_gasto: event.target.value as TipoGasto,
                      }))
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
                  placeholder="3500"
                  min={1}
                  value={movimientoForm.monto}
                  onChange={(event) =>
                    setMovimientoForm((prev) => ({ ...prev, monto: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Descripcion (opcional)</label>
                <Input
                  placeholder="Detalle del movimiento"
                  value={movimientoForm.descripcion}
                  onChange={(event) =>
                    setMovimientoForm((prev) => ({ ...prev, descripcion: event.target.value }))
                  }
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
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cuentas</CardTitle>
            <CardDescription>Cuentas disponibles en el usuario actual.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:hidden">
              {cuentas.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay cuentas registradas aun.</p>
              )}
              {cuentas.map((cuenta) => (
                <div key={cuenta.id_cuenta} className="rounded-lg border p-3">
                  <p className="font-medium">{cuenta.nombre_cuenta}</p>
                  <p className="text-sm text-muted-foreground">{cuenta.tipo_cuenta}</p>
                  <p className="text-sm text-muted-foreground">{cuenta.nombre_banco ?? "-"}</p>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cuenta</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Banco</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cuentas.map((cuenta) => (
                    <TableRow key={cuenta.id_cuenta}>
                      <TableCell>{cuenta.nombre_cuenta}</TableCell>
                      <TableCell>{cuenta.tipo_cuenta}</TableCell>
                      <TableCell>{cuenta.nombre_banco ?? "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimientos Recientes</CardTitle>
            <CardDescription>Ultimos 10 registros cargados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:hidden">
              {movimientosRecientes.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay movimientos recientes.</p>
              )}
              {movimientosRecientes.map((movimiento) => (
                <div key={movimiento.id_transaccion} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium capitalize">{movimiento.tipo_movimiento}</p>
                    <p className="text-sm font-semibold">${movimiento.monto}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{movimiento.categoria ?? "-"}</p>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientosRecientes.map((movimiento) => (
                    <TableRow key={movimiento.id_transaccion}>
                      <TableCell>{movimiento.tipo_movimiento}</TableCell>
                      <TableCell>{movimiento.categoria ?? "-"}</TableCell>
                      <TableCell>{movimiento.monto}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
