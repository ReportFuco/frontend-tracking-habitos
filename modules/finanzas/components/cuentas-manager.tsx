"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useFinanzas } from "@/modules/finanzas/hooks/useFinanzas"
import { TIPOS_CUENTA } from "@/modules/finanzas/schemas/finanzas.schema"
import { TipoCuenta } from "@/modules/finanzas/types/finanzas"

export function CuentasManager() {
  const { cuentas, editarCuenta, eliminarCuenta } = useFinanzas()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")
  const [editingTipo, setEditingTipo] = useState<TipoCuenta>("Cuenta Corriente")

  const onSave = async (idCuenta: number) => {
    const result = await editarCuenta(idCuenta, {
      nombre_cuenta: editingName.trim() || null,
      tipo_cuenta: editingTipo,
    })

    if (result.ok) {
      toast.success("Cuenta actualizada", {
        description: "Los cambios de la cuenta se guardaron correctamente.",
      })
      setEditingId(null)
      setEditingName("")
      return
    }

    toast.error("No pudimos actualizar la cuenta", {
      description: result.message,
    })
  }

  const onDelete = async (idCuenta: number) => {
    const result = await eliminarCuenta(idCuenta)

    if (result.ok) {
      toast.success("Cuenta desactivada", {
        description: "La cuenta fue desactivada correctamente.",
      })
      return
    }

    toast.error("No pudimos desactivar la cuenta", {
      description: result.message,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cuentas</CardTitle>
        <CardDescription>Editar o desactivar cuentas existentes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {cuentas.map((cuenta) => (
            <div key={cuenta.id_cuenta} className="rounded-md border p-3">
              {editingId === cuenta.id_cuenta ? (
                <div className="space-y-2">
                  <Input value={editingName} onChange={(event) => setEditingName(event.target.value)} />
                  <select
                    className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
                    value={editingTipo}
                    onChange={(event) => setEditingTipo(event.target.value as TipoCuenta)}
                  >
                    {TIPOS_CUENTA.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <Button onClick={() => onSave(cuenta.id_cuenta)}>Guardar</Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{cuenta.nombre_cuenta}</p>
                    <p className="text-sm text-muted-foreground">{cuenta.tipo_cuenta}</p>
                    <p className="text-xs text-muted-foreground">Banco: {cuenta.nombre_banco ?? "-"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingId(cuenta.id_cuenta)
                        setEditingName(cuenta.nombre_cuenta)
                        setEditingTipo(cuenta.tipo_cuenta)
                      }}
                    >
                      Editar
                    </Button>
                    <Button variant="destructive" onClick={() => onDelete(cuenta.id_cuenta)}>
                      Desactivar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
