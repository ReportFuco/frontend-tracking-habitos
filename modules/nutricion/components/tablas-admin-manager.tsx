"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EditorialInput, FieldGroup, FormPanel, FormSubmitBar } from "@/components/forms/editorial-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SearchableCombobox } from "@/components/forms/searchable-combobox"
import { NutricionAPI } from "@/modules/nutricion/api/nutricion.api"
import { CatalogoAPI } from "@/modules/catalogo/api/catalogo.api"
import type { TablaNutricionalResponse } from "@/modules/nutricion/types/nutricion"
import type { ProductoResponse } from "@/modules/catalogo/types/catalogo"

type FormState = {
  id_producto: string
  porcion_cantidad: string
  porcion_unidad: string
  calorias: string
  proteinas: string
  carbohidratos: string
  grasas: string
  azucares: string
  sodio: string
  fibra: string
}

const emptyForm: FormState = {
  id_producto: "",
  porcion_cantidad: "",
  porcion_unidad: "g",
  calorias: "",
  proteinas: "",
  carbohidratos: "",
  grasas: "",
  azucares: "",
  sodio: "",
  fibra: "",
}

const toCreatePayload = (f: FormState) => ({
  id_producto: Number(f.id_producto),
  porcion_cantidad: Number(f.porcion_cantidad),
  porcion_unidad: f.porcion_unidad.trim(),
  calorias: Number(f.calorias),
  proteinas: Number(f.proteinas),
  carbohidratos: Number(f.carbohidratos),
  grasas: Number(f.grasas),
  azucares: f.azucares ? Number(f.azucares) : null,
  sodio: f.sodio ? Number(f.sodio) : null,
  fibra: f.fibra ? Number(f.fibra) : null,
})

const toPatchPayload = (f: FormState) => ({
  porcion_cantidad: Number(f.porcion_cantidad) || null,
  porcion_unidad: f.porcion_unidad.trim() || null,
  calorias: Number(f.calorias) || null,
  proteinas: Number(f.proteinas) || null,
  carbohidratos: Number(f.carbohidratos) || null,
  grasas: Number(f.grasas) || null,
  azucares: f.azucares ? Number(f.azucares) : null,
  sodio: f.sodio ? Number(f.sodio) : null,
  fibra: f.fibra ? Number(f.fibra) : null,
})

const toFormState = (t: TablaNutricionalResponse): FormState => ({
  id_producto: String(t.id_producto),
  porcion_cantidad: String(t.porcion_cantidad),
  porcion_unidad: t.porcion_unidad,
  calorias: String(t.calorias),
  proteinas: String(t.proteinas),
  carbohidratos: String(t.carbohidratos),
  grasas: String(t.grasas),
  azucares: t.azucares != null ? String(t.azucares) : "",
  sodio: t.sodio != null ? String(t.sodio) : "",
  fibra: t.fibra != null ? String(t.fibra) : "",
})

export function TablasAdminManager() {
  const [tablas, setTablas] = useState<TablaNutricionalResponse[]>([])
  const [productos, setProductos] = useState<ProductoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const isEditing = editingId !== null

  useEffect(() => {
    void Promise.all([NutricionAPI.getTablas(), CatalogoAPI.getProductos()])
      .then(([ts, ps]) => { setTablas(ts); setProductos(ps) })
      .catch(() => toast.error("Error al cargar datos"))
      .finally(() => setLoading(false))
  }, [])

  const productoOptions = useMemo(
    () => productos.map((p) => ({
      value: String(p.id_producto),
      label: p.nombre_producto,
      description: p.nombre_marca ?? undefined,
    })),
    [productos],
  )

  const cancelEdit = () => { setEditingId(null); setForm(emptyForm) }
  const set = (patch: Partial<FormState>) => setForm((p) => ({ ...p, ...patch }))

  const isValid = (f: FormState) =>
    f.id_producto && f.porcion_cantidad && f.porcion_unidad.trim() &&
    f.calorias && f.proteinas && f.carbohidratos && f.grasas

  const handleSubmit = async () => {
    if (!isValid(form)) {
      toast.error("Producto, porcion y macros principales son requeridos")
      return
    }
    setSubmitting(true)
    try {
      if (isEditing) {
        const updated = await NutricionAPI.updateTabla(editingId!, toPatchPayload(form))
        setTablas((prev) => prev.map((t) => (t.id_tabla === editingId ? updated : t)))
        toast.success("Tabla actualizada")
        cancelEdit()
      } else {
        const nueva = await NutricionAPI.createTabla(toCreatePayload(form))
        setTablas((prev) => [...prev, nueva])
        toast.success("Tabla nutricional creada")
        setForm(emptyForm)
      }
    } catch {
      toast.error("No se pudo guardar la tabla")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (idTabla: number) => {
    setSubmitting(true)
    try {
      await NutricionAPI.deleteTabla(idTabla)
      setTablas((prev) => prev.filter((t) => t.id_tabla !== idTabla))
      toast.success("Tabla eliminada")
    } catch {
      toast.error("No se pudo eliminar la tabla")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
      <FormPanel eyebrow={isEditing ? "Editando tabla" : "Nueva tabla nutricional"}>
        <div className="space-y-4 sm:space-y-5">
          <FieldGroup label="Producto">
            <SearchableCombobox
              value={form.id_producto}
              onChange={(v) => set({ id_producto: v })}
              options={productoOptions}
              placeholder="Selecciona un producto"
              searchPlaceholder="Buscar producto..."
              allowClear={false}
              disabled={isEditing}
            />
          </FieldGroup>
          <FieldGroup label="Porcion">
            <div className="grid grid-cols-2 gap-2">
              <EditorialInput type="number" placeholder="30" value={form.porcion_cantidad} onChange={(e) => set({ porcion_cantidad: e.target.value })} />
              <EditorialInput placeholder="g, ml..." value={form.porcion_unidad} onChange={(e) => set({ porcion_unidad: e.target.value })} />
            </div>
          </FieldGroup>
          <FieldGroup label="Calorias (kcal)">
            <EditorialInput type="number" placeholder="120" value={form.calorias} onChange={(e) => set({ calorias: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="Macros principales">
            <div className="grid grid-cols-3 gap-2">
              <EditorialInput type="number" placeholder="Prot. (g)" value={form.proteinas} onChange={(e) => set({ proteinas: e.target.value })} />
              <EditorialInput type="number" placeholder="Carbos (g)" value={form.carbohidratos} onChange={(e) => set({ carbohidratos: e.target.value })} />
              <EditorialInput type="number" placeholder="Grasas (g)" value={form.grasas} onChange={(e) => set({ grasas: e.target.value })} />
            </div>
          </FieldGroup>
          <FieldGroup label="Opcionales">
            <div className="grid grid-cols-3 gap-2">
              <EditorialInput type="number" placeholder="Azuc. (g)" value={form.azucares} onChange={(e) => set({ azucares: e.target.value })} />
              <EditorialInput type="number" placeholder="Sodio (mg)" value={form.sodio} onChange={(e) => set({ sodio: e.target.value })} />
              <EditorialInput type="number" placeholder="Fibra (g)" value={form.fibra} onChange={(e) => set({ fibra: e.target.value })} />
            </div>
          </FieldGroup>
          <FormSubmitBar>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={submitting} className="w-full sm:w-auto">
                {submitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear tabla"}
              </Button>
              {isEditing ? <Button variant="ghost" onClick={cancelEdit}>Cancelar</Button> : null}
            </div>
          </FormSubmitBar>
        </div>
      </FormPanel>

      <FormPanel eyebrow="Catalogo">
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        ) : tablas.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay tablas registradas.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Porcion · Macros</TableHead>
                <TableHead className="w-20 text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tablas.map((tabla) => (
                <TableRow key={tabla.id_tabla}>
                  <TableCell className="font-medium">
                    {tabla.nombre_producto ?? `#${tabla.id_producto}`}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{tabla.porcion_cantidad} {tabla.porcion_unidad} · {tabla.calorias} kcal</div>
                    <div className="text-xs">P:{tabla.proteinas}g C:{tabla.carbohidratos}g G:{tabla.grasas}g</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon" variant="ghost"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => { setEditingId(tabla.id_tabla); setForm(toFormState(tabla)) }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon" variant="ghost"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(tabla.id_tabla)}
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
      </FormPanel>
    </section>
  )
}
