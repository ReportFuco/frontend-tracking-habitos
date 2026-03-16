"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useFinanzas } from "@/modules/finanzas/hooks/useFinanzas"

export function CategoriasManager() {
  const { categorias, error, crearCategoria, editarCategoria, eliminarCategoria } = useFinanzas()
  const [nuevaCategoria, setNuevaCategoria] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")
  const [uiMessage, setUiMessage] = useState<string | null>(null)

  const onCreate = async () => {
    if (!nuevaCategoria.trim()) {
      setUiMessage("Ingresa el nombre de la categoria")
      return
    }

    const result = await crearCategoria({ nombre: nuevaCategoria.trim() })
    setUiMessage(result.ok ? "Categoria creada" : result.message)

    if (result.ok) {
      setNuevaCategoria("")
    }
  }

  const onSave = async (idCategoria: number) => {
    if (!editingName.trim()) {
      setUiMessage("El nombre no puede ir vacio")
      return
    }

    const result = await editarCategoria(idCategoria, { nombre: editingName.trim() })
    setUiMessage(result.ok ? "Categoria actualizada" : result.message)

    if (result.ok) {
      setEditingId(null)
      setEditingName("")
    }
  }

  const onDelete = async (idCategoria: number) => {
    const result = await eliminarCategoria(idCategoria)
    setUiMessage(result.ok ? "Categoria eliminada" : result.message)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorias</CardTitle>
        <CardDescription>CRUD completo para categorias.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(uiMessage || error) && (
          <div className="rounded-md border border-amber-500/40 bg-amber-50 p-3 text-sm text-amber-900">
            {uiMessage ?? error}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Nueva categoria"
            value={nuevaCategoria}
            onChange={(event) => setNuevaCategoria(event.target.value)}
          />
          <Button onClick={onCreate}>Crear</Button>
        </div>

        <div className="space-y-2">
          {categorias.map((categoria) => (
            <div key={categoria.id_categoria} className="rounded-md border p-3">
              {editingId === categoria.id_categoria ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input value={editingName} onChange={(event) => setEditingName(event.target.value)} />
                  <Button onClick={() => onSave(categoria.id_categoria)}>Guardar</Button>
                  <Button variant="outline" onClick={() => setEditingId(null)}>
                    Cancelar
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{categoria.nombre}</p>
                    <p className="text-xs text-muted-foreground">ID: {categoria.id_categoria}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingId(categoria.id_categoria)
                        setEditingName(categoria.nombre)
                      }}
                    >
                      Editar
                    </Button>
                    <Button variant="destructive" onClick={() => onDelete(categoria.id_categoria)}>
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
