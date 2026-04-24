"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EditorialInput, FieldGroup, FormPanel, FormSubmitBar } from "@/components/forms/editorial-form"
import { useFinanzas } from "@/modules/finanzas/hooks/useFinanzas"

export function BancosManager() {
  const { bancos, crearBanco, editarBanco, eliminarBanco } = useFinanzas()
  const [submitting, setSubmitting] = useState(false)
  const [nuevoBanco, setNuevoBanco] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  const onCreate = async () => {
    if (!nuevoBanco.trim()) {
      toast.error("Nombre requerido")
      return
    }
    setSubmitting(true)
    const result = await crearBanco({ nombre_banco: nuevoBanco.trim() })
    setSubmitting(false)
    if (result.ok) {
      toast.success("Banco creado")
      setNuevoBanco("")
      return
    }
    toast.error("No se pudo crear el banco", { description: result.message })
  }

  const onSave = async (idBanco: number) => {
    if (!editingName.trim()) {
      toast.error("Nombre requerido")
      return
    }
    setSubmitting(true)
    const result = await editarBanco(idBanco, { nombre_banco: editingName.trim() })
    setSubmitting(false)
    if (result.ok) {
      toast.success("Banco actualizado")
      setEditingId(null)
      return
    }
    toast.error("No se pudo actualizar el banco", { description: result.message })
  }

  const onDelete = async (idBanco: number) => {
    setSubmitting(true)
    const result = await eliminarBanco(idBanco)
    setSubmitting(false)
    if (result.ok) {
      toast.success("Banco eliminado")
      return
    }
    toast.error("No se pudo eliminar el banco", { description: result.message })
  }

  return (
    <FormPanel eyebrow="Finanzas maestras">
      <div className="space-y-6 sm:space-y-7">
        <FieldGroup label="Nuevo banco">
          <div className="flex gap-2">
            <EditorialInput
              placeholder="Nombre del banco"
              value={nuevoBanco}
              onChange={(e) => setNuevoBanco(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void onCreate()}
            />
            <Button onClick={onCreate} disabled={submitting} className="shrink-0">
              Crear
            </Button>
          </div>
        </FieldGroup>

        {bancos.length > 0 ? (
          <div className="space-y-2">
            {bancos.map((banco) => (
              <div key={banco.id_banco} className="rounded-4xl bg-surface-low px-4 py-3.5">
                {editingId === banco.id_banco ? (
                  <div className="space-y-3">
                    <EditorialInput
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && void onSave(banco.id_banco)}
                      autoFocus
                    />
                    <FormSubmitBar>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => onSave(banco.id_banco)} disabled={submitting}>
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
                    <p className="text-sm font-medium">{banco.nombre_banco}</p>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingId(banco.id_banco)
                          setEditingName(banco.nombre_banco)
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(banco.id_banco)}
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
