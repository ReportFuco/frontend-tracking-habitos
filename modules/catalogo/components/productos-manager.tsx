"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EditorialInput, FieldGroup, FormPanel, FormSubmitBar } from "@/components/forms/editorial-form"
import { CatalogoAPI } from "@/modules/catalogo/api/catalogo.api"
import type { ProductoResponse, MarcaResponse } from "@/modules/catalogo/types/catalogo"

const SELECT_CLASS =
  "h-13 w-full rounded-3xl border-0 bg-surface-variant px-4 text-sm text-foreground shadow-none outline-none transition focus:border-b-2 focus:border-primary"

type ProductoFormState = {
  nombre_producto: string
  id_marca: string
  codigo_barra: string
  sabor: string
  formato: string
  contenido_neto: string
  unidad_contenido: string
}

const emptyForm: ProductoFormState = {
  nombre_producto: "",
  id_marca: "",
  codigo_barra: "",
  sabor: "",
  formato: "",
  contenido_neto: "",
  unidad_contenido: "",
}

const toPayload = (f: ProductoFormState) => ({
  nombre_producto: f.nombre_producto.trim(),
  id_marca: f.id_marca ? Number(f.id_marca) : null,
  codigo_barra: f.codigo_barra.trim() || null,
  sabor: f.sabor.trim() || null,
  formato: f.formato.trim() || null,
  contenido_neto: f.contenido_neto ? Number(f.contenido_neto) : null,
  unidad_contenido: f.unidad_contenido.trim() || null,
})

const toFormState = (p: ProductoResponse): ProductoFormState => ({
  nombre_producto: p.nombre_producto,
  id_marca: p.id_marca != null ? String(p.id_marca) : "",
  codigo_barra: p.codigo_barra ?? "",
  sabor: p.sabor ?? "",
  formato: p.formato ?? "",
  contenido_neto: p.contenido_neto != null ? String(p.contenido_neto) : "",
  unidad_contenido: p.unidad_contenido ?? "",
})

export function ProductosManager() {
  const [productos, setProductos] = useState<ProductoResponse[]>([])
  const [marcas, setMarcas] = useState<MarcaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState<ProductoFormState>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingForm, setEditingForm] = useState<ProductoFormState>(emptyForm)

  useEffect(() => {
    void CatalogoAPI.getMarcas().then(setMarcas).catch(() => null)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      void CatalogoAPI.getProductos(search.trim() ? { q: search.trim() } : undefined)
        .then(setProductos)
        .catch(() => toast.error("Error al cargar productos"))
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timer)
  }, [search])

  const handleCreate = async () => {
    if (!form.nombre_producto.trim()) {
      toast.error("Nombre requerido")
      return
    }
    setSubmitting(true)
    try {
      const producto = await CatalogoAPI.createProducto(toPayload(form))
      setProductos((prev) => [...prev, producto])
      setForm(emptyForm)
      toast.success("Producto creado")
    } catch {
      toast.error("No se pudo crear el producto")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSave = async (idProducto: number) => {
    if (!editingForm.nombre_producto.trim()) {
      toast.error("Nombre requerido")
      return
    }
    setSubmitting(true)
    try {
      const updated = await CatalogoAPI.updateProducto(idProducto, toPayload(editingForm))
      setProductos((prev) => prev.map((p) => (p.id_producto === idProducto ? updated : p)))
      setEditingId(null)
      toast.success("Producto actualizado")
    } catch {
      toast.error("No se pudo actualizar el producto")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (idProducto: number) => {
    setSubmitting(true)
    try {
      await CatalogoAPI.deleteProducto(idProducto)
      setProductos((prev) => prev.filter((p) => p.id_producto !== idProducto))
      toast.success("Producto desactivado")
    } catch {
      toast.error("No se pudo desactivar el producto")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
      <FormPanel eyebrow="Nuevo producto">
        <div className="space-y-4 sm:space-y-5">
          <FieldGroup label="Nombre">
            <EditorialInput
              placeholder="Ej: Yogurt protein"
              value={form.nombre_producto}
              onChange={(e) => setForm((p) => ({ ...p, nombre_producto: e.target.value }))}
            />
          </FieldGroup>
          <FieldGroup label="Marca" hint="Opcional">
            <select
              value={form.id_marca}
              onChange={(e) => setForm((p) => ({ ...p, id_marca: e.target.value }))}
              className={SELECT_CLASS}
            >
              <option value="">Sin marca</option>
              {marcas.map((m) => (
                <option key={m.id_marca} value={m.id_marca}>
                  {m.nombre_marca}
                </option>
              ))}
            </select>
          </FieldGroup>
          <FieldGroup label="Codigo de barra" hint="Opcional">
            <EditorialInput
              placeholder="7801234567890"
              value={form.codigo_barra}
              onChange={(e) => setForm((p) => ({ ...p, codigo_barra: e.target.value }))}
            />
          </FieldGroup>
          <FieldGroup label="Sabor / Formato" hint="Opcional">
            <div className="grid grid-cols-2 gap-2">
              <EditorialInput
                placeholder="Sabor"
                value={form.sabor}
                onChange={(e) => setForm((p) => ({ ...p, sabor: e.target.value }))}
              />
              <EditorialInput
                placeholder="Formato"
                value={form.formato}
                onChange={(e) => setForm((p) => ({ ...p, formato: e.target.value }))}
              />
            </div>
          </FieldGroup>
          <FieldGroup label="Contenido neto" hint="Opcional">
            <div className="grid grid-cols-2 gap-2">
              <EditorialInput
                type="number"
                placeholder="350"
                value={form.contenido_neto}
                onChange={(e) => setForm((p) => ({ ...p, contenido_neto: e.target.value }))}
              />
              <EditorialInput
                placeholder="ml, g, kg..."
                value={form.unidad_contenido}
                onChange={(e) => setForm((p) => ({ ...p, unidad_contenido: e.target.value }))}
              />
            </div>
          </FieldGroup>
          <FormSubmitBar>
            <Button onClick={handleCreate} disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Guardando..." : "Crear producto"}
            </Button>
          </FormSubmitBar>
        </div>
      </FormPanel>

      <FormPanel eyebrow="Gestion">
        <div className="space-y-4 sm:space-y-5">
          <FieldGroup label="Buscar">
            <EditorialInput
              placeholder="Nombre del producto"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FieldGroup>

          <div className="space-y-2">
            {loading ? (
              <p className="text-sm text-muted-foreground">Cargando...</p>
            ) : productos.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay productos con ese filtro.</p>
            ) : null}

            {productos.map((prod) => (
              <div key={prod.id_producto} className="rounded-4xl bg-surface-low p-4">
                {editingId === prod.id_producto ? (
                  <div className="space-y-3">
                    <EditorialInput
                      value={editingForm.nombre_producto}
                      onChange={(e) => setEditingForm((p) => ({ ...p, nombre_producto: e.target.value }))}
                      autoFocus
                    />
                    <select
                      value={editingForm.id_marca}
                      onChange={(e) => setEditingForm((p) => ({ ...p, id_marca: e.target.value }))}
                      className={SELECT_CLASS}
                    >
                      <option value="">Sin marca</option>
                      {marcas.map((m) => (
                        <option key={m.id_marca} value={m.id_marca}>
                          {m.nombre_marca}
                        </option>
                      ))}
                    </select>
                    <EditorialInput
                      placeholder="Codigo de barra"
                      value={editingForm.codigo_barra}
                      onChange={(e) => setEditingForm((p) => ({ ...p, codigo_barra: e.target.value }))}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <EditorialInput
                        placeholder="Sabor"
                        value={editingForm.sabor}
                        onChange={(e) => setEditingForm((p) => ({ ...p, sabor: e.target.value }))}
                      />
                      <EditorialInput
                        placeholder="Formato"
                        value={editingForm.formato}
                        onChange={(e) => setEditingForm((p) => ({ ...p, formato: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <EditorialInput
                        type="number"
                        placeholder="Contenido neto"
                        value={editingForm.contenido_neto}
                        onChange={(e) => setEditingForm((p) => ({ ...p, contenido_neto: e.target.value }))}
                      />
                      <EditorialInput
                        placeholder="Unidad"
                        value={editingForm.unidad_contenido}
                        onChange={(e) => setEditingForm((p) => ({ ...p, unidad_contenido: e.target.value }))}
                      />
                    </div>
                    <FormSubmitBar>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(prod.id_producto)} disabled={submitting}>
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
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{prod.nombre_producto}</p>
                        {!prod.activo ? (
                          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                            Inactivo
                          </span>
                        ) : null}
                      </div>
                      {prod.nombre_marca ? (
                        <p className="text-xs text-muted-foreground">{prod.nombre_marca}</p>
                      ) : null}
                      {prod.codigo_barra ? (
                        <p className="font-mono text-xs text-muted-foreground">{prod.codigo_barra}</p>
                      ) : null}
                      {prod.contenido_neto != null ? (
                        <p className="text-xs text-muted-foreground">
                          {prod.contenido_neto} {prod.unidad_contenido}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingId(prod.id_producto)
                          setEditingForm(toFormState(prod))
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(prod.id_producto)}
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
        </div>
      </FormPanel>
    </section>
  )
}
