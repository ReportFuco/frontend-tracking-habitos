"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EditorialInput, FormPanel } from "@/components/forms/editorial-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ComprasAPI } from "@/modules/compras/api/compras.api"
import type { CadenaResponse } from "@/modules/compras/types/compras"

export function CadenasManager() {
  const [cadenas, setCadenas] = useState<CadenaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formValue, setFormValue] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const isEditing = editingId !== null

  useEffect(() => {
    void ComprasAPI.getCadenas()
      .then(setCadenas)
      .catch(() => toast.error("Error al cargar cadenas"))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async () => {
    if (!formValue.trim()) { toast.error("Nombre requerido"); return }
    setSubmitting(true)
    try {
      if (isEditing) {
        const updated = await ComprasAPI.updateCadena(editingId!, { nombre_cadena: formValue.trim() })
        setCadenas((prev) => prev.map((c) => (c.id_cadena === editingId ? updated : c)))
        toast.success("Cadena actualizada")
      } else {
        const nueva = await ComprasAPI.createCadena({ nombre_cadena: formValue.trim() })
        setCadenas((prev) => [...prev, nueva])
        toast.success("Cadena creada")
      }
      setFormValue("")
      setEditingId(null)
    } catch {
      toast.error("No se pudo guardar la cadena")
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
      <div className="space-y-5">
        <div className="flex gap-2">
          <EditorialInput
            placeholder={isEditing ? "Nuevo nombre de la cadena" : "Nombre de la cadena"}
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleSubmit()}
            autoFocus={isEditing}
          />
          <Button onClick={handleSubmit} disabled={submitting} className="shrink-0">
            {isEditing ? "Guardar" : "Crear"}
          </Button>
          {isEditing ? (
            <Button variant="ghost" className="shrink-0" onClick={() => { setEditingId(null); setFormValue("") }}>
              Cancelar
            </Button>
          ) : null}
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        ) : cadenas.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay cadenas registradas.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cadena</TableHead>
                <TableHead className="w-20 text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {cadenas.map((cadena) => (
                <TableRow key={cadena.id_cadena}>
                  <TableCell className="font-medium">{cadena.nombre_cadena}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon" variant="ghost"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => { setEditingId(cadena.id_cadena); setFormValue(cadena.nombre_cadena) }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon" variant="ghost"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(cadena.id_cadena)}
                        disabled={submitting}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </FormPanel>
  )
}
