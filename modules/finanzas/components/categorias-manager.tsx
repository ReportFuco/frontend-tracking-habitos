"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EditorialInput, FieldGroup, FormPanel, FormSubmitBar } from "@/components/forms/editorial-form"
import { useFinanzas } from "@/modules/finanzas/hooks/useFinanzas"

export function CategoriasManager() {
  const { categorias, submitting, crearCategoria, editarCategoria, eliminarCategoria } = useFinanzas()
  const [nuevaCategoria, setNuevaCategoria] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  const onCreate = async () => {
    if (!nuevaCategoria.trim()) {
      toast.error("Nombre requerido")
      return
    }
    const result = await crearCategoria({ nombre: nuevaCategoria.trim() })
    if (result.ok) {
      toast.success("Categoria creada")
      setNuevaCategoria("")
      return
    }
    toast.error("No se pudo crear la categoria", { description: result.message })
  }

  const onSave = async (idCategoria: number) => {
    if (!editingName.trim()) {
      toast.error("Nombre requerido")
      return
    }
    const result = await editarCategoria(idCategoria, { nombre: editingName.trim() })
    if (result.ok) {
      toast.success("Categoria actualizada")
      setEditingId(null)
      return
    }
    toast.error("No se pudo actualizar la categoria", { description: result.message })
  }

  const onDelete = async (idCategoria: number) => {
    const result = await eliminarCategoria(idCategoria)
    if (result.ok) {
      toast.success("Categoria eliminada")
      return
    }
    toast.error("No se pudo eliminar la categoria", { description: result.message })
  }

  return (
    <FormPanel eyebrow="Finanzas maestras">
      <div className="space-y-6 sm:space-y-7">
        <FieldGroup label="Nueva categoria">
          <div className="flex gap-2">
            <EditorialInput
              placeholder="Nombre de la categoria"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void onCreate()}
            />
            <Button onClick={onCreate} disabled={submitting} className="shrink-0">
              Crear
            </Button>
          </div>
        </FieldGroup>

        {categorias.length > 0 ? (
          <div className="space-y-2">
            {categorias.map((categoria) => (
              <div key={categoria.id_categoria} className="rounded-4xl bg-surface-low px-4 py-3.5">
                {editingId === categoria.id_categoria ? (
                  <div className="space-y-3">
                    <EditorialInput
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && void onSave(categoria.id_categoria)}
                      autoFocus
                    />
                    <FormSubmitBar>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => onSave(categoria.id_categoria)} disabled={submitting}>
                          Guardar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </FormSubmitBar>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium capitalize">{categoria.nombre}</p>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingId(categoria.id_categoria)
                          setEditingName(categoria.nombre)
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(categoria.id_categoria)}
                        disabled={submitting}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </FormPanel>
  )
}
