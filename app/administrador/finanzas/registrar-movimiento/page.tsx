import { MovimientoFormCard } from "@/modules/finanzas/components/movimiento-form"
import { FinanzasMenuLinks } from "@/modules/finanzas/components/menu-links"

export default function RegistrarMovimientoPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 p-4 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Registrar Movimiento</h1>
        <p className="text-sm text-muted-foreground">
          Flujo dedicado para registrar gastos e ingresos.
        </p>
        <FinanzasMenuLinks />
      </header>

      <MovimientoFormCard />
    </main>
  )
}
