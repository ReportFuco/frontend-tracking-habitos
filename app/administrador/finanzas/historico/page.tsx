import { HistoricoCards } from "@/modules/finanzas/components/historico-cards"
import { FinanzasMenuLinks } from "@/modules/finanzas/components/menu-links"

export default function HistoricoFinanzasPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-4 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Historico de Finanzas</h1>
        <p className="text-sm text-muted-foreground">
          Vista separada para revisar cuentas y movimientos.
        </p>
        <FinanzasMenuLinks />
      </header>

      <HistoricoCards />
    </main>
  )
}
