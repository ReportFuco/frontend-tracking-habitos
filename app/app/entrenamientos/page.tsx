import Link from "next/link"
import { ArrowUpRight, Dumbbell } from "lucide-react"
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
        description="Lleva un diario de tus sesiones de fuerza con el detalle de cada serie."
      />

      <section className="surface-section flex flex-col gap-4">
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Dejamos el modulo mas despejado para que el recorrido se entienda desde el breadcrumb y la navegacion lateral, sin sumar bloques de acceso dentro de la propia pantalla.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/app/entrenamientos/activo"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-lowest)] px-4 py-2 text-sm text-foreground shadow-[var(--shadow-airy)] transition hover:bg-[color:var(--surface-variant)]"
          >
            Ir al entreno activo
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="surface-section flex items-center gap-4">
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
            Tip
          </p>
          <p className="text-sm text-foreground">
            Solo puedes tener una sesion activa a la vez: cierrala antes de iniciar una nueva.
          </p>
        </div>
      </section>
    </div>
  )
}
