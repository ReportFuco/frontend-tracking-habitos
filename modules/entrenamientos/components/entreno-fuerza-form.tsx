"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowRight, Flame } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EditorialSelect, FieldGroup, FormNote, FormPanel } from "@/components/forms/editorial-form"
import { entrenoFuerzaCreateSchema } from "@/modules/entrenamientos/schemas/entrenamientos.schema"
import { useEntrenamientos } from "@/modules/entrenamientos/hooks/useEntrenamientos"

const initialForm = {
  id_gimnasio: "",
  observacion: "",
}

const textareaClassName =
  "min-h-32 w-full rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-b-2 focus:border-[color:var(--module-entrenamientos)]"

export function EntrenoFuerzaFormCard() {
  const { gimnasios, entrenamientoActivo, submitting, iniciarEntrenoFuerza } = useEntrenamientos()
  const searchParams = useSearchParams()
  const initialGymId = searchParams.get("id_gimnasio") ?? ""
  const [form, setForm] = useState(() => ({
    ...initialForm,
    id_gimnasio: initialGymId,
  }))

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
      toast.success("Entrenamiento activo", {
        description: "La sesion ya quedo abierta para registrar series.",
      })
      return
    }

    toast.error("No pudimos abrir el entrenamiento", {
      description: result.message,
    })
  }

  const availableGimnasios = gimnasios.filter((gimnasio) => gimnasio.activo)
  const selectedGym = availableGimnasios.find(
    (gimnasio) => String(gimnasio.id_gimnasio) === form.id_gimnasio
  )

  return (
    <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
      <FormPanel
        eyebrow="Registro"
        title="Registrar entrenamiento en gym"
        description="Abre tu sesion, elige el gimnasio y deja listo el espacio donde despues iras registrando tus series."
        accent="tertiary"
      >
        <div className="space-y-6">
          {entrenamientoActivo ? (
            <div className="rounded-[1.5rem] bg-[color:var(--surface-low)] p-5">
              <p className="font-label text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground">
                Sesion activa
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                Ya tienes un entrenamiento en curso.
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Tu sesion actual ya esta asociada a {entrenamientoActivo.nombre_gimnasio ?? "un gimnasio"}.
                Desde aqui te llevamos directo al espacio donde se registran las series.
              </p>
              <Link
                href="/app/entrenamientos/activo"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-[color:var(--module-entrenamientos)]"
              >
                Ir a entrenamiento activo
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <FieldGroup
                label="Gimnasio"
                hint={availableGimnasios.length ? "Contexto de la sesion" : "Sin opciones activas"}
              >
                <EditorialSelect
                  value={form.id_gimnasio}
                  onChange={(event) => setForm((prev) => ({ ...prev, id_gimnasio: event.target.value }))}
                  required
                  disabled={submitting || availableGimnasios.length === 0}
                  className="focus:border-[color:var(--module-entrenamientos)]"
                >
                  <option value="">Selecciona un gimnasio</option>
                  {availableGimnasios.map((gimnasio) => (
                    <option key={gimnasio.id_gimnasio} value={gimnasio.id_gimnasio}>
                      {gimnasio.nombre_gimnasio}
                      {gimnasio.comuna ? ` · ${gimnasio.comuna}` : ""}
                    </option>
                  ))}
                </EditorialSelect>
              </FieldGroup>

              <FieldGroup label="Observacion" hint="Opcional">
                <textarea
                  className={textareaClassName}
                  placeholder="Ej: enfasis en torso, energia media, tecnica limpia, molestias leves..."
                  value={form.observacion}
                  onChange={(event) => setForm((prev) => ({ ...prev, observacion: event.target.value }))}
                />
              </FieldGroup>

              <FormNote>
                Cuando actives esta sesion, el entrenamiento quedara vinculado a este gimnasio y tus registros se iran armando desde ese contexto.
              </FormNote>

              {selectedGym ? (
                <FormNote>
                  Vas a abrir la sesion en <span className="font-medium text-foreground">{selectedGym.nombre_gimnasio}</span>
                  {selectedGym.comuna ? `, ${selectedGym.comuna}` : ""}.
                </FormNote>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  disabled={submitting || availableGimnasios.length === 0}
                  className="bg-[color:var(--module-entrenamientos)] text-[color:var(--tertiary-foreground)] hover:bg-[color:var(--module-entrenamientos)]/90"
                >
                  {submitting ? "Abriendo sesion..." : "Registrar entrenamiento"}
                </Button>
                <Button asChild variant="ghost" className="text-foreground hover:text-[color:var(--module-entrenamientos)]">
                  <Link href="/app/entrenamientos/gimnasios">Ver gimnasios</Link>
                </Button>
              </div>
            </form>
          )}

          {availableGimnasios.length === 0 ? (
            <FormNote>
              Aun no hay gimnasios disponibles para elegir. Cuando aparezcan, podras volver aqui y abrir tu siguiente sesion.
            </FormNote>
          ) : null}
        </div>
      </FormPanel>

      <section className="space-y-4">
        <article className="rounded-[1.75rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)]">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Flame className="size-4 text-[color:var(--module-entrenamientos)]" />
            Paso a paso
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-[1.25rem] bg-[color:var(--surface-low)] p-4">
              <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                1. Elige el gimnasio
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                Selecciona el lugar donde vas a entrenar hoy.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[color:var(--surface-low)] p-4">
              <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                2. Abre la sesion
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                El entrenamiento queda activo y listo para empezar.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[color:var(--surface-low)] p-4">
              <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                3. Registra tus series
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                Continua en entrenamiento activo mientras avanzas en tu rutina.
              </p>
            </div>
          </div>
        </article>
      </section>
    </section>
  )
}
