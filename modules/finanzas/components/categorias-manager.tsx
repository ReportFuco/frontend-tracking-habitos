"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useFinanzas } from "@/modules/finanzas/hooks/useFinanzas"

export function CategoriasManager() {
  const { categorias, crearCategoria, editarCategoria, eliminarCategoria } = useFinanzas()
  const [nuevaCategoria, setNuevaCategoria] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  const onCreate = async () => {
    if (!nuevaCategoria.trim()) {
      toast.error("Nombre requerido", {
        description: "Ingresa el nombre de la categoria.",
      })
      return
    }

    const result = await crearCategoria({ nombre: nuevaCategoria.trim() })

    if (result.ok) {
      toast.success("Categoria creada", {
        description: "La categoria se agrego correctamente.",
      })
      setNuevaCategoria("")
      return
    }

    toast.error("No pudimos crear la categoria", {
      description: result.message,
    })
  }

  const onSave = async (idCategoria: number) => {
    if (!editingName.trim()) {
      toast.error("Nombre requerido", {
        description: "El nombre de la categoria no puede ir vacio.",
      })
      return
    }

    const result = await editarCategoria(idCategoria, { nombre: editingName.trim() })

    if (result.ok) {
      toast.success("Categoria actualizada", {
        description: "Los cambios se guardaron correctamente.",
      })
      setEditingId(null)
      setEditingName("")
      return
    }

    toast.error("No pudimos actualizar la categoria", {
      description: result.message,
    })
  }

  const onDelete = async (idCategoria: number) => {
    const result = await eliminarCategoria(idCategoria)

    if (result.ok) {
      toast.success("Categoria eliminada", {
        description: "La categoria se elimino correctamente.",
      })
      return
    }

    toast.error("No pudimos eliminar la categoria", {
      description: result.message,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorias</CardTitle>
        <CardDescription>CRUD completo para categorias.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
