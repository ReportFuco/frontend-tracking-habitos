"use client"

import { FormEvent, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { entrenoFuerzaCreateSchema } from "@/modules/entrenamientos/schemas/entrenamientos.schema"
import { useEntrenamientos } from "@/modules/entrenamientos/hooks/useEntrenamientos"

const initialForm = {
  id_gimnasio: "",
  observacion: "",
}

export function EntrenoFuerzaFormCard() {
  const { gimnasios, entrenamientoActivo, submitting, iniciarEntrenoFuerza } = useEntrenamientos()
  const [form, setForm] = useState(initialForm)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = entrenoFuerzaCreateSchema.safeParse({
      id_gimnasio: Number(form.id_gimnasio),
      observacion: form.observacion || null,
    })

    if (!parsed.success) {
      toast.error("Revisa el formulario", {
        description: parsed.error.issues[0]?.message ?? "Selecciona un gimnasio valido.",
      })
      return
    }

    const result = await iniciarEntrenoFuerza(parsed.data)

    if (result.ok) {
      setForm(initialForm)
      toast.success("Entrenamiento iniciado", {
        description: "La sesion de fuerza ya esta activa.",
      })
      return
    }

    toast.error("No pudimos iniciar el entrenamiento", {
      description: result.message,
    })
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Iniciar entrenamiento de fuerza</CardTitle>
          <CardDescription>Selecciona el gimnasio y deja una observacion opcional.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Gimnasio</label>
              <select
                className="border-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
                value={form.id_gimnasio}
                onChange={(event) => setForm((prev) => ({ ...prev, id_gimnasio: event.target.value }))}
                required
              >
                <option value="">Selecciona un gimnasio</option>
                {gimnasios.map((gimnasio) => (
                  <option key={gimnasio.id_gimnasio} value={gimnasio.id_gimnasio}>
                    {gimnasio.nombre_gimnasio}
                    {gimnasio.comuna ? ` · ${gimnasio.comuna}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Observacion</label>
              <textarea
                className="border-input min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Ej: enfoque en empuje superior, energia media, molestias leves..."
                value={form.observacion}
                onChange={(event) => setForm((prev) => ({ ...prev, observacion: event.target.value }))}
              />
            </div>

            <Button type="submit" disabled={submitting || gimnasios.length === 0}>
              {submitting ? "Iniciando..." : "Iniciar sesion"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estado actual</CardTitle>
          <CardDescription>Resumen rapido del entrenamiento de fuerza en curso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {entrenamientoActivo ? (
            <>
              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Entrenamiento activo</p>
                <p className="font-medium">{entrenamientoActivo.nombre_gimnasio ?? "Sin gimnasio"}</p>
                <p className="text-sm text-muted-foreground">
                  {entrenamientoActivo.nombre_cadena ?? "Sin cadena"} ·{" "}
                  {entrenamientoActivo.comuna ?? "Sin comuna"}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Series registradas</p>
                <p className="text-2xl font-semibold">{entrenamientoActivo.series?.length ?? 0}</p>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              No hay un entrenamiento activo ahora mismo.
            </div>
          )}

          {gimnasios.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Antes de iniciar una sesion necesitas registrar al menos un gimnasio.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </section>
  )
}
