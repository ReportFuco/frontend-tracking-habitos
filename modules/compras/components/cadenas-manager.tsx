"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EditorialInput, FieldGroup, FormPanel, FormSubmitBar } from "@/components/forms/editorial-form"
import { ComprasAPI } from "@/modules/compras/api/compras.api"
import type { CadenaResponse } from "@/modules/compras/types/compras"

export function CadenasManager() {
  const [cadenas, setCadenas] = useState<CadenaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  useEffect(() => {
    void ComprasAPI.getCadenas()
      .then(setCadenas)
      .catch(() => toast.error("Error al cargar cadenas"))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error("Nombre requerido")
      return
    }
    setSubmitting(true)
    try {
      const cadena = await ComprasAPI.createCadena({ nombre_cadena: newName.trim() })
      setCadenas((prev) => [...prev, cadena])
      setNewName("")
      toast.success("Cadena creada")
    } catch {
      toast.error("No se pudo crear la cadena")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSave = async (idCadena: number) => {
    if (!editingName.trim()) {
      toast.error("Nombre requerido")
      return
    }
    setSubmitting(true)
    try {
      const updated = await ComprasAPI.updateCadena(idCadena, { nombre_cadena: editingName.trim() })
      setCadenas((prev) => prev.map((c) => (c.id_cadena === idCadena ? updated : c)))
      setEditingId(null)
      toast.success("Cadena actualizada")
    } catch {
      toast.error("No se pudo actualizar la cadena")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (idCadena: number) => {
    setSubmitting(true)
    try {
      await ComprasAPI.deleteCadena(idCadena)
      setCadenas((prev) => prev.filter((c) => c.id_cadena !== idCadena))
      toast.success("Cadena eliminada")
    } catch {
      toast.error("No se pudo eliminar la cadena")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FormPanel eyebrow="Compras maestras">
      <div className="space-y-6 sm:space-y-7">
        <FieldGroup label="Nueva cadena">
          <div className="flex gap-2">
            <EditorialInput
              placeholder="Nombre de la cadena"
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
        ) : cadenas.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay cadenas registradas.</p>
        ) : (
          <div className="space-y-2">
            {cadenas.map((cadena) => (
              <div key={cadena.id_cadena} className="rounded-4xl bg-surface-low px-4 py-3.5">
                {editingId === cadena.id_cadena ? (
                  <div className="space-y-3">
                    <EditorialInput
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && void handleSave(cadena.id_cadena)}
                      autoFocus
                    />
                    <FormSubmitBar>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(cadena.id_cadena)} disabled={submitting}>
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
                    <p className="text-sm font-medium">{cadena.nombre_cadena}</p>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingId(cadena.id_cadena)
                          setEditingName(cadena.nombre_cadena)
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(cadena.id_cadena)}
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
