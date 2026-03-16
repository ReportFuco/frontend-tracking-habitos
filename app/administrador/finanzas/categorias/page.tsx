import { CategoriasManager } from "@/modules/finanzas/components/categorias-manager"
import { FinanzasMenuLinks } from "@/modules/finanzas/components/menu-links"

export default function CategoriasPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 p-4 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Gestion de Categorias</h1>
        <p className="text-sm text-muted-foreground">Crea, edita y elimina categorias.</p>
        <FinanzasMenuLinks />
      </header>

      <CategoriasManager />
    </main>
  )
}
