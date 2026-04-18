import { CategoriasManager } from "@/modules/finanzas/components/categorias-manager"
import { FinanzasProvider } from "@/modules/finanzas/hooks/useFinanzas"
import { PageHeader } from "@/components/shell/page-header"

export default function CategoriasPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Catalogo"
        title="Categorias"
        description="Crea, edita y elimina las categorias de movimientos."
      />

      <FinanzasProvider>
        <CategoriasManager />
      </FinanzasProvider>
    </div>
  )
}
