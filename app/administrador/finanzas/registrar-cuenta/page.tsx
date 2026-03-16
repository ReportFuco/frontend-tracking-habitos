import { CuentaFormCard } from "@/modules/finanzas/components/cuenta-form"
import { FinanzasMenuLinks } from "@/modules/finanzas/components/menu-links"

export default function RegistrarCuentaPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 p-4 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Registrar Cuenta</h1>
        <p className="text-sm text-muted-foreground">
          Flujo dedicado para registrar nuevas cuentas financieras.
        </p>
        <FinanzasMenuLinks />
      </header>

      <CuentaFormCard />
    </main>
  )
}
