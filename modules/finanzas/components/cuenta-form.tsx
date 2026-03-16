"use client"

import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useFinanzas } from "@/modules/finanzas/hooks/useFinanzas"
import { cuentaCreateSchema, TIPOS_CUENTA } from "@/modules/finanzas/schemas/finanzas.schema"
import { TipoCuenta } from "@/modules/finanzas/types/finanzas"

const initialCuentaForm = {
  id_banco: "",
  nombre_cuenta: "",
  tipo_cuenta: "Cuenta Corriente" as TipoCuenta,
}

export function CuentaFormCard() {
  const { bancos, loadingCatalogos, submittingCuenta, error, crearCuenta } = useFinanzas()
  const [form, setForm] = useState(initialCuentaForm)
  const [uiMessage, setUiMessage] = useState<string | null>(null)

  const handleCreateCuenta = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUiMessage(null)

    const parsed = cuentaCreateSchema.safeParse({
      id_banco: Number(form.id_banco),
      nombre_cuenta: form.nombre_cuenta,
      tipo_cuenta: form.tipo_cuenta,
    })

    if (!parsed.success) {
      setUiMessage(parsed.error.issues[0]?.message ?? "Formulario de cuenta invalido")
      return
    }

    const result = await crearCuenta(parsed.data)

    if (result.ok) {
      setForm(initialCuentaForm)
      setUiMessage("Cuenta creada correctamente")
      return
    }

    setUiMessage(result.message)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Cuenta</CardTitle>
        <CardDescription>Crea una nueva cuenta bancaria para el usuario actual.</CardDescription>
      </CardHeader>
      <CardContent>
        {(error || uiMessage) && (
          <div className="mb-3 rounded-md border border-amber-500/40 bg-amber-50 p-3 text-sm text-amber-900">
            {uiMessage ?? error}
          </div>
        )}

        <form onSubmit={handleCreateCuenta} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Banco</label>
            <select
              className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
              value={form.id_banco}
              onChange={(event) => setForm((prev) => ({ ...prev, id_banco: event.target.value }))}
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
              value={form.nombre_cuenta}
              onChange={(event) => setForm((prev) => ({ ...prev, nombre_cuenta: event.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Tipo de Cuenta</label>
            <select
              className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
              value={form.tipo_cuenta}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, tipo_cuenta: event.target.value as TipoCuenta }))
              }
            >
              {TIPOS_CUENTA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full sm:w-auto" disabled={submittingCuenta || loadingCatalogos}>
            {submittingCuenta ? "Guardando..." : "Crear cuenta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
