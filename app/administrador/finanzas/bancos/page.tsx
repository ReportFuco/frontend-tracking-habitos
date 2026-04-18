import { BancosManager } from "@/modules/finanzas/components/bancos-manager"
import { FinanzasProvider } from "@/modules/finanzas/hooks/useFinanzas"
import { PageHeader } from "@/components/shell/page-header"

export default function BancosPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Catalogo"
        title="Bancos"
        description="Crea, edita y elimina los bancos del catalogo maestro."
      />

      <FinanzasProvider>
        <BancosManager />
      </FinanzasProvider>
    </div>
  )
}
