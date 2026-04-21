"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EditorialInput, FieldGroup, FormPanel, FormSubmitBar } from "@/components/forms/editorial-form"
import { CatalogoAPI } from "@/modules/catalogo/api/catalogo.api"
import type { MarcaResponse } from "@/modules/catalogo/types/catalogo"

export function MarcasManager() {
  const [marcas, setMarcas] = useState<MarcaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  useEffect(() => {
    void CatalogoAPI.getMarcas()
      .then(setMarcas)
      .catch(() => toast.error("Error al cargar marcas"))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error("Nombre requerido")
      return
    }
    setSubmitting(true)
    try {
      const marca = await CatalogoAPI.createMarca({ nombre_marca: newName.trim() })
      setMarcas((prev) => [...prev, marca])
      setNewName("")
      toast.success("Marca creada")
    } catch {
      toast.error("No se pudo crear la marca")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSave = async (idMarca: number) => {
    if (!editingName.trim()) {
      toast.error("Nombre requerido")
      return
    }
    setSubmitting(true)
    try {
      const updated = await CatalogoAPI.updateMarca(idMarca, { nombre_marca: editingName.trim() })
      setMarcas((prev) => prev.map((m) => (m.id_marca === idMarca ? updated : m)))
      setEditingId(null)
      toast.success("Marca actualizada")
    } catch {
      toast.error("No se pudo actualizar la marca")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (idMarca: number) => {
    setSubmitting(true)
    try {
      await CatalogoAPI.deleteMarca(idMarca)
      setMarcas((prev) => prev.filter((m) => m.id_marca !== idMarca))
      toast.success("Marca eliminada")
    } catch {
      toast.error("No se pudo eliminar la marca")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FormPanel eyebrow="Catalogo">
      <div className="space-y-6 sm:space-y-7">
        <FieldGroup label="Nueva marca">
          <div className="flex gap-2">
            <EditorialInput
              placeholder="Nombre de la marca"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void handleCreate()}
            />
            <Button onClick={handleCreate} disabled={submitting} className="shrink-0">
              Crear
            </Button>
          </div>
        </FieldGroup>

        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        ) : marcas.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay marcas registradas.</p>
        ) : (
          <div className="space-y-2">
            {marcas.map((marca) => (
              <div key={marca.id_marca} className="rounded-4xl bg-surface-low px-4 py-3.5">
                {editingId === marca.id_marca ? (
                  <div className="space-y-3">
                    <EditorialInput
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && void handleSave(marca.id_marca)}
                      autoFocus
                    />
                    <FormSubmitBar>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(marca.id_marca)} disabled={submitting}>
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
                    <p className="text-sm font-medium">{marca.nombre_marca}</p>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingId(marca.id_marca)
                          setEditingName(marca.nombre_marca)
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(marca.id_marca)}
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
        )}
      </div>
    </FormPanel>
  )
}
