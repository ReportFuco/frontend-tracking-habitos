import { MovimientoFormCard } from "@/modules/finanzas/components/movimiento-form"
import { MovimientosManager } from "@/modules/finanzas/components/movimientos-manager"
import { FinanzasProvider } from "@/modules/finanzas/hooks/useFinanzas"
import { FinanzasMenuLinks } from "@/modules/finanzas/components/menu-links"

export default function MovimientosPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-4 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Gestion de Movimientos</h1>
        <p className="text-sm text-muted-foreground">
          Registra y edita movimientos (tu API actual no expone delete para movimientos).
        </p>
        <FinanzasMenuLinks />
      </header>

      <FinanzasProvider>
        <section className="grid gap-6 lg:grid-cols-2">
          <MovimientoFormCard />
          <MovimientosManager />
        </section>
      </FinanzasProvider>
    </main>
  )
}
