import { EntrenamientosMenuLinks } from "@/modules/entrenamientos/components/menu-links"
import { EntrenamientoActivoCard } from "@/modules/entrenamientos/components/entrenamiento-activo-card"
import { EntrenamientosProvider } from "@/modules/entrenamientos/hooks/useEntrenamientos"

export default function EntrenoActivoPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-4 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Entrenamiento Activo</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona la sesion abierta, agrega series y cierra el entrenamiento cuando termines.
        </p>
        <EntrenamientosMenuLinks />
      </header>

      <EntrenamientosProvider>
        <EntrenamientoActivoCard />
      </EntrenamientosProvider>
    </main>
  )
}
