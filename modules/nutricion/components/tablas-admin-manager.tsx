"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EditorialInput, FieldGroup, FormPanel, FormSubmitBar } from "@/components/forms/editorial-form"
import { NutricionAPI } from "@/modules/nutricion/api/nutricion.api"
import { CatalogoAPI } from "@/modules/catalogo/api/catalogo.api"
import type { TablaNutricionalResponse } from "@/modules/nutricion/types/nutricion"
import type { ProductoResponse } from "@/modules/catalogo/types/catalogo"

const SELECT_CLASS =
  "h-13 w-full rounded-3xl border-0 bg-surface-variant px-4 text-sm text-foreground shadow-none outline-none transition focus:border-b-2 focus:border-primary"

type TablaFormState = {
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

const emptyForm: TablaFormState = {
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

const toCreatePayload = (f: TablaFormState) => ({
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

const toPatchPayload = (f: TablaFormState) => ({
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

const toFormState = (t: TablaNutricionalResponse): TablaFormState => ({
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
  const [form, setForm] = useState<TablaFormState>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingForm, setEditingForm] = useState<TablaFormState>(emptyForm)

  useEffect(() => {
    void Promise.all([NutricionAPI.getTablas(), CatalogoAPI.getProductos()])
      .then(([ts, ps]) => {
        setTablas(ts)
        setProductos(ps)
      })
      .catch(() => toast.error("Error al cargar datos"))
      .finally(() => setLoading(false))
  }, [])

  const isCreateValid = (f: TablaFormState) =>
    f.id_producto && f.porcion_cantidad && f.porcion_unidad.trim() &&
    f.calorias && f.proteinas && f.carbohidratos && f.grasas

  const handleCreate = async () => {
    if (!isCreateValid(form)) {
      toast.error("Producto, porcion y macros principales son requeridos")
      return
    }
    setSubmitting(true)
    try {
      const tabla = await NutricionAPI.createTabla(toCreatePayload(form))
      setTablas((prev) => [...prev, tabla])
      setForm(emptyForm)
      toast.success("Tabla nutricional creada")
    } catch {
      toast.error("No se pudo crear la tabla nutricional")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSave = async (idTabla: number) => {
    setSubmitting(true)
    try {
      const updated = await NutricionAPI.updateTabla(idTabla, toPatchPayload(editingForm))
      setTablas((prev) => prev.map((t) => (t.id_tabla === idTabla ? updated : t)))
      setEditingId(null)
      toast.success("Tabla actualizada")
    } catch {
      toast.error("No se pudo actualizar la tabla")
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
      <FormPanel eyebrow="Nueva tabla nutricional">
        <div className="space-y-4 sm:space-y-5">
          <FieldGroup label="Producto">
            <select
              value={form.id_producto}
              onChange={(e) => setForm((p) => ({ ...p, id_producto: e.target.value }))}
              className={SELECT_CLASS}
            >
              <option value="">Selecciona un producto</option>
              {productos.map((p) => (
                <option key={p.id_producto} value={p.id_producto}>
                  {p.nombre_producto}
                  {p.nombre_marca ? ` — ${p.nombre_marca}` : ""}
                </option>
              ))}
            </select>
          </FieldGroup>
          <FieldGroup label="Porcion">
            <div className="grid grid-cols-2 gap-2">
              <EditorialInput
                type="number"
                placeholder="30"
                value={form.porcion_cantidad}
                onChange={(e) => setForm((p) => ({ ...p, porcion_cantidad: e.target.value }))}
              />
              <EditorialInput
                placeholder="g, ml..."
                value={form.porcion_unidad}
                onChange={(e) => setForm((p) => ({ ...p, porcion_unidad: e.target.value }))}
              />
            </div>
          </FieldGroup>
          <FieldGroup label="Calorias (kcal)">
            <EditorialInput
              type="number"
              placeholder="120"
              value={form.calorias}
              onChange={(e) => setForm((p) => ({ ...p, calorias: e.target.value }))}
            />
          </FieldGroup>
          <FieldGroup label="Macros principales">
            <div className="grid grid-cols-3 gap-2">
              <EditorialInput
                type="number"
                placeholder="Prot. (g)"
                value={form.proteinas}
                onChange={(e) => setForm((p) => ({ ...p, proteinas: e.target.value }))}
              />
              <EditorialInput
                type="number"
                placeholder="Carbos (g)"
                value={form.carbohidratos}
                onChange={(e) => setForm((p) => ({ ...p, carbohidratos: e.target.value }))}
              />
              <EditorialInput
                type="number"
                placeholder="Grasas (g)"
                value={form.grasas}
                onChange={(e) => setForm((p) => ({ ...p, grasas: e.target.value }))}
              />
            </div>
          </FieldGroup>
          <FieldGroup label="Opcionales">
            <div className="grid grid-cols-3 gap-2">
              <EditorialInput
                type="number"
                placeholder="Azuc. (g)"
                value={form.azucares}
                onChange={(e) => setForm((p) => ({ ...p, azucares: e.target.value }))}
              />
              <EditorialInput
                type="number"
                placeholder="Sodio (mg)"
                value={form.sodio}
                onChange={(e) => setForm((p) => ({ ...p, sodio: e.target.value }))}
              />
              <EditorialInput
                type="number"
                placeholder="Fibra (g)"
                value={form.fibra}
                onChange={(e) => setForm((p) => ({ ...p, fibra: e.target.value }))}
              />
            </div>
          </FieldGroup>
          <FormSubmitBar>
            <Button onClick={handleCreate} disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Guardando..." : "Crear tabla"}
            </Button>
          </FormSubmitBar>
        </div>
      </FormPanel>

      <FormPanel eyebrow="Gestion">
        <div className="space-y-2">
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : tablas.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay tablas nutricionales registradas.</p>
          ) : null}

          {tablas.map((tabla) => (
            <div key={tabla.id_tabla} className="rounded-4xl bg-surface-low p-4">
              {editingId === tabla.id_tabla ? (
                <div className="space-y-3">
                  <FieldGroup label="Porcion">
                    <div className="grid grid-cols-2 gap-2">
                      <EditorialInput
                        type="number"
                        placeholder="Cantidad"
                        value={editingForm.porcion_cantidad}
                        onChange={(e) => setEditingForm((p) => ({ ...p, porcion_cantidad: e.target.value }))}
                        autoFocus
                      />
                      <EditorialInput
                        placeholder="Unidad"
                        value={editingForm.porcion_unidad}
                        onChange={(e) => setEditingForm((p) => ({ ...p, porcion_unidad: e.target.value }))}
                      />
                    </div>
                  </FieldGroup>
                  <EditorialInput
                    type="number"
                    placeholder="Calorias (kcal)"
                    value={editingForm.calorias}
                    onChange={(e) => setEditingForm((p) => ({ ...p, calorias: e.target.value }))}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <EditorialInput
                      type="number"
                      placeholder="Prot."
                      value={editingForm.proteinas}
                      onChange={(e) => setEditingForm((p) => ({ ...p, proteinas: e.target.value }))}
                    />
                    <EditorialInput
                      type="number"
                      placeholder="Carbos"
                      value={editingForm.carbohidratos}
                      onChange={(e) => setEditingForm((p) => ({ ...p, carbohidratos: e.target.value }))}
                    />
                    <EditorialInput
                      type="number"
                      placeholder="Grasas"
                      value={editingForm.grasas}
                      onChange={(e) => setEditingForm((p) => ({ ...p, grasas: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <EditorialInput
                      type="number"
                      placeholder="Azucares"
                      value={editingForm.azucares}
                      onChange={(e) => setEditingForm((p) => ({ ...p, azucares: e.target.value }))}
                    />
                    <EditorialInput
                      type="number"
                      placeholder="Sodio"
                      value={editingForm.sodio}
                      onChange={(e) => setEditingForm((p) => ({ ...p, sodio: e.target.value }))}
                    />
                    <EditorialInput
                      type="number"
                      placeholder="Fibra"
                      value={editingForm.fibra}
                      onChange={(e) => setEditingForm((p) => ({ ...p, fibra: e.target.value }))}
                    />
                  </div>
                  <FormSubmitBar>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(tabla.id_tabla)} disabled={submitting}>
                        Guardar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </FormSubmitBar>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {tabla.nombre_producto ?? `Producto #${tabla.id_producto}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Porcion {tabla.porcion_cantidad} {tabla.porcion_unidad} · {tabla.calorias} kcal
                    </p>
                    <p className="text-xs text-muted-foreground">
                      P: {tabla.proteinas}g · C: {tabla.carbohidratos}g · G: {tabla.grasas}g
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setEditingId(tabla.id_tabla)
                        setEditingForm(toFormState(tabla))
                      }}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(tabla.id_tabla)}
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
      </FormPanel>
    </section>
  )
}
