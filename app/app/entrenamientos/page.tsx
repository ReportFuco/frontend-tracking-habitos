import Link from "next/link"
import { ArrowRight, Dumbbell } from "lucide-react"
import { ContextNav } from "@/components/shell/context-nav"
import { PageHeader } from "@/components/shell/page-header"

export default function EntrenamientosHomePage() {
  return (
    <div className="flex flex-col gap-8">
      <ContextNav
        crumbs={[
          { label: "Inicio", href: "/app/dashboard" },
          { label: "Entrenamientos" },
        ]}
      />

      <PageHeader
        eyebrow="Modulo"
        title="Entrenamientos"
        description="Este modulo se ordena en tres frentes claros: ver gimnasios, registrar entrenamiento y revisar entrenamientos anteriores."
      />

      <section className="surface-section flex flex-col gap-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm leading-6 text-muted-foreground sm:text-base">
            La idea aqui no es abrir muchas rutas en paralelo, sino dejar un recorrido claro: primero eliges contexto, luego registras tu sesion y despues revisas lo que ya hiciste.
          </p>
          <p className="text-sm leading-6 text-muted-foreground sm:text-base">
            Cuando exista un entrenamiento activo, el registro y ajuste de series vive dentro de esa sesion, no en el historico ni en la portada del modulo.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <article className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)]">
            <p className="font-label text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
              Frente 01
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Ver gimnasios</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Revisa los gimnasios disponibles para elegir bien el contexto de tu sesion antes de comenzar.
            </p>
            <Link
              href="/app/entrenamientos/gimnasios"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-[color:var(--module-entrenamientos)]"
            >
              Ir a gimnasios
              <ArrowRight className="size-4" />
            </Link>
          </article>

          <article className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)]">
            <p className="font-label text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
              Frente 02
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Registrar entrenamiento</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Abre tu entrenamiento en gym y deja la sesion marcada como activa para administrar ahi mismo las series.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/app/entrenamientos/registrar"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-[color:var(--module-entrenamientos)]"
              >
                Ir a registrar entrenamiento
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/app/entrenamientos/activo"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
              >
                Ver entrenamiento activo
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>

          <article className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)]">
            <p className="font-label text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
              Frente 03
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Entrenamientos anteriores</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Consulta sesiones cerradas, revisa sus series y vuelve sobre tus ultimos registros cuando lo necesites.
            </p>
            <Link
              href="/app/entrenamientos/historico"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-[color:var(--module-entrenamientos)]"
            >
              Ver entrenamientos anteriores
              <ArrowRight className="size-4" />
            </Link>
          </article>
        </div>

        <div className="flex items-center gap-4 rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-5 shadow-[var(--shadow-airy)]">
          <span
            className="flex size-11 items-center justify-center rounded-lg"
            style={{
              background: "color-mix(in oklch, var(--module-entrenamientos) 14%, transparent)",
              color: "var(--module-entrenamientos)",
            }}
          >
            <Dumbbell className="size-5" />
          </span>
          <div className="flex-1">
            <p className="font-[family-name:var(--font-label)] text-[0.7rem] uppercase tracking-wider text-muted-foreground">
              Nota
            </p>
            <p className="text-sm text-foreground">
              Solo puedes tener una sesion activa a la vez. Por eso el flujo principal es abrirla en
              registrar entrenamiento y despues administrar sus series en entrenamiento activo.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
