import { EntrenamientosMenuLinks } from "@/modules/entrenamientos/components/menu-links"
import { EntrenoFuerzaFormCard } from "@/modules/entrenamientos/components/entreno-fuerza-form"
import { EntrenamientosProvider } from "@/modules/entrenamientos/hooks/useEntrenamientos"

export default function IniciarFuerzaPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-4 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Iniciar Entrenamiento de Fuerza</h1>
        <p className="text-sm text-muted-foreground">
          Abre una nueva sesion y deja lista la captura de series.
        </p>
        <EntrenamientosMenuLinks />
      </header>

      <EntrenamientosProvider>
        <EntrenoFuerzaFormCard />
      </EntrenamientosProvider>
    </main>
  )
}
