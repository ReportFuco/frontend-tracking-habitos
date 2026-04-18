"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowRight, Flame, MapPin } from "lucide-react"
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
        description="Aqui se abre la sesion y queda marcada como activa. El registro y ajuste de series continua despues dentro de entrenamiento activo."
        accent="tertiary"
        aside={
          <div className="space-y-4">
            <div className="rounded-[1.25rem] bg-white/70 p-4">
              <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                Gimnasios
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {availableGimnasios.length}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Lugares activos disponibles para elegir antes de abrir tu sesion.
              </p>
            </div>

            <div className="rounded-[1.25rem] bg-white/70 p-4">
              <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                Estado
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                {entrenamientoActivo
                  ? "Ya existe una sesion abierta. Continua registrando series dentro del entrenamiento activo."
                  : "No tienes una sesion activa. Este es el punto correcto para abrir una nueva."}
              </p>
            </div>
          </div>
        }
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
                La sesion actual esta asociada a {entrenamientoActivo.nombre_gimnasio ?? "un gimnasio"}.
                Para evitar duplicados, desde aqui solo te llevamos al espacio donde se registran las series.
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
                Al crear el entrenamiento, la API lo deja como <span className="font-medium text-foreground">activo</span>. Desde ese momento la gestion de series continua en la vista de entrenamiento activo.
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
              Todavia no hay gimnasios activos para seleccionar. Como este catalogo depende del panel
              admin, por ahora tu ruta mas util es revisar la lista disponible en gimnasios.
            </FormNote>
          ) : null}
        </div>
      </FormPanel>

      <section className="space-y-4">
        <article className="rounded-[1.75rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)]">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Flame className="size-4 text-[color:var(--module-entrenamientos)]" />
            Flujo del modulo
          </p>
          <div className="mt-4 space-y-4">
            <div className="rounded-[1.25rem] bg-[color:var(--surface-low)] p-4">
              <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                1. Registrar
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                Se abre la sesion y queda activa con el gimnasio seleccionado.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[color:var(--surface-low)] p-4">
              <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                2. Entrenamiento activo
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                En esa vista agregas, corriges o eliminas series mientras entrenas.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[color:var(--surface-low)] p-4">
              <p className="font-label text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                3. Historico
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                Una vez cerrada la sesion, pasa al historico para consulta posterior.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[1.75rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)]">
          <p className="font-label text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
            Contexto
          </p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <p className="flex items-start gap-2">
              <MapPin className="mt-1 size-4 shrink-0 text-[color:var(--module-entrenamientos)]" />
              El gimnasio sirve como marco de la sesion, aunque el seguimiento fino despues vive en las series.
            </p>
            <p>
              No hace falta mencionar otros tipos de entrenamiento: la interfaz habla de entrenamiento en gym y deja que el producto se sienta natural.
            </p>
          </div>
        </article>
      </section>
    </section>
  )
}
