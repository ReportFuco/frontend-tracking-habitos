import { CuentaFormCard } from "@/modules/finanzas/components/cuenta-form"
import { CuentasManager } from "@/modules/finanzas/components/cuentas-manager"
import { FinanzasProvider } from "@/modules/finanzas/hooks/useFinanzas"
import { FinanzasMenuLinks } from "@/modules/finanzas/components/menu-links"
import { PageHeader } from "@/components/shell/page-header"

export default function CuentasPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Finanzas"
        title="Cuentas bancarias"
        description="Registra, edita y revisa las cuentas bancarias con las que trabajas en el modulo."
      />
      <FinanzasMenuLinks />

      <FinanzasProvider>
        <section className="grid gap-6 lg:grid-cols-2">
          <CuentaFormCard />
          <CuentasManager />
        </section>
      </FinanzasProvider>
    </div>
  )
}
