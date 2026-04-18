import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ContextNav } from "@/components/shell/context-nav"
import { PageHeader } from "@/components/shell/page-header"

export default function FinanzasHomePage() {
  return (
    <div className="flex flex-col gap-8">
      <ContextNav
        crumbs={[
          { label: "Inicio", href: "/app/dashboard" },
          { label: "Finanzas" },
        ]}
      />

      <PageHeader
        eyebrow="Modulo"
        title="Finanzas"
        description="Desde aqui vamos a trabajar dos frentes claros: cuentas bancarias y registro de movimientos."
      />

      <section className="surface-section flex flex-col gap-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm leading-6 text-muted-foreground sm:text-base">
            Este modulo deja de funcionar como una mini-home con muchas rutas. La idea es que el recorrido se entienda como un flujo natural dentro de la app.
          </p>
          <p className="text-sm leading-6 text-muted-foreground sm:text-base">
            En esta etapa nos vamos a concentrar solo en dos piezas: administrar cuentas bancarias y registrar movimientos sobre esas cuentas.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)]">
            <p className="font-[family-name:var(--font-label)] text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
              Frente 01
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Registrar movimientos</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Aqui el foco es registrar gastos e ingresos de forma clara, y luego revisar esos movimientos cuando haga falta.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/app/finanzas/registrar-movimiento"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-[color:var(--module-finanzas)]"
              >
                Ir a registrar movimientos
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/app/finanzas/movimientos"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
              >
                Ver movimientos
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>

          <article className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-6 shadow-[var(--shadow-airy)]">
            <p className="font-[family-name:var(--font-label)] text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
              Frente 02
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Cuentas bancarias</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Aqui trabajamos la base del modulo: crear, revisar y mantener las cuentas bancarias desde las que luego se registran los movimientos.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/app/finanzas/registrar-cuenta"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-[color:var(--module-finanzas)]"
              >
                Ir a cuentas bancarias
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/app/finanzas/cuentas"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
              >
                Ver cuentas
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>
        </div>

        <div className="rounded-[1.5rem] bg-[color:var(--surface-lowest)] p-5 shadow-[var(--shadow-airy)]">
          <p className="font-[family-name:var(--font-label)] text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            Nota
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Dejamos el historico y otras vistas como apoyo secundario. El corazon del modulo, por ahora, seran estos dos flujos.
          </p>
        </div>
      </section>
    </div>
  )
}
