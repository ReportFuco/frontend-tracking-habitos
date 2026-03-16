"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useFinanzas } from "@/modules/finanzas/hooks/useFinanzas"

export function BancosManager() {
  const { bancos, error, crearBanco, editarBanco, eliminarBanco } = useFinanzas()
  const [nuevoBanco, setNuevoBanco] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")
  const [uiMessage, setUiMessage] = useState<string | null>(null)

  const onCreate = async () => {
    if (!nuevoBanco.trim()) {
      setUiMessage("Ingresa el nombre del banco")
      return
    }

    const result = await crearBanco({ nombre_banco: nuevoBanco.trim() })
    setUiMessage(result.ok ? "Banco creado" : result.message)

    if (result.ok) {
      setNuevoBanco("")
    }
  }

  const onSave = async (idBanco: number) => {
    if (!editingName.trim()) {
      setUiMessage("El nombre no puede ir vacio")
      return
    }

    const result = await editarBanco(idBanco, { nombre_banco: editingName.trim() })
    setUiMessage(result.ok ? "Banco actualizado" : result.message)

    if (result.ok) {
      setEditingId(null)
      setEditingName("")
    }
  }

  const onDelete = async (idBanco: number) => {
    const result = await eliminarBanco(idBanco)
    setUiMessage(result.ok ? "Banco eliminado" : result.message)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bancos</CardTitle>
        <CardDescription>CRUD completo para bancos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(uiMessage || error) && (
          <div className="rounded-md border border-amber-500/40 bg-amber-50 p-3 text-sm text-amber-900">
            {uiMessage ?? error}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Nuevo banco"
            value={nuevoBanco}
            onChange={(event) => setNuevoBanco(event.target.value)}
          />
          <Button onClick={onCreate}>Crear</Button>
        </div>

        <div className="space-y-2">
          {bancos.map((banco) => (
            <div key={banco.id_banco} className="rounded-md border p-3">
              {editingId === banco.id_banco ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input value={editingName} onChange={(event) => setEditingName(event.target.value)} />
                  <Button onClick={() => onSave(banco.id_banco)}>Guardar</Button>
                  <Button variant="outline" onClick={() => setEditingId(null)}>
                    Cancelar
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{banco.nombre_banco}</p>
                    <p className="text-xs text-muted-foreground">ID: {banco.id_banco}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingId(banco.id_banco)
                        setEditingName(banco.nombre_banco)
                      }}
                    >
                      Editar
                    </Button>
                    <Button variant="destructive" onClick={() => onDelete(banco.id_banco)}>
                      Eliminar
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
