"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useFinanzas } from "@/modules/finanzas/hooks/useFinanzas"

export function BancosManager() {
  const { bancos, crearBanco, editarBanco, eliminarBanco } = useFinanzas()
  const [nuevoBanco, setNuevoBanco] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  const onCreate = async () => {
    if (!nuevoBanco.trim()) {
      toast.error("Nombre requerido", {
        description: "Ingresa el nombre del banco.",
      })
      return
    }

    const result = await crearBanco({ nombre_banco: nuevoBanco.trim() })

    if (result.ok) {
      toast.success("Banco creado", {
        description: "El banco se agrego correctamente.",
      })
      setNuevoBanco("")
      return
    }

    toast.error("No pudimos crear el banco", {
      description: result.message,
    })
  }

  const onSave = async (idBanco: number) => {
    if (!editingName.trim()) {
      toast.error("Nombre requerido", {
        description: "El nombre del banco no puede ir vacio.",
      })
      return
    }

    const result = await editarBanco(idBanco, { nombre_banco: editingName.trim() })

    if (result.ok) {
      toast.success("Banco actualizado", {
        description: "Los cambios se guardaron correctamente.",
      })
      setEditingId(null)
      setEditingName("")
      return
    }

    toast.error("No pudimos actualizar el banco", {
      description: result.message,
    })
  }

  const onDelete = async (idBanco: number) => {
    const result = await eliminarBanco(idBanco)

    if (result.ok) {
      toast.success("Banco eliminado", {
        description: "El banco se elimino correctamente.",
      })
      return
    }

    toast.error("No pudimos eliminar el banco", {
      description: result.message,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bancos</CardTitle>
        <CardDescription>CRUD completo para bancos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
