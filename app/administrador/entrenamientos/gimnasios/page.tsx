import { EntrenamientosMenuLinks } from "@/modules/entrenamientos/components/menu-links"
import { GimnasiosManager } from "@/modules/entrenamientos/components/gimnasios-manager"
import { EntrenamientosProvider } from "@/modules/entrenamientos/hooks/useEntrenamientos"

export default function GimnasiosEntrenamientosPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-4 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Gestion de Gimnasios</h1>
        <p className="text-sm text-muted-foreground">
          Crea, busca y administra los gimnasios asociados a tus entrenamientos.
        </p>
        <EntrenamientosMenuLinks />
      </header>

      <EntrenamientosProvider>
        <GimnasiosManager />
      </EntrenamientosProvider>
    </main>
  )
}
