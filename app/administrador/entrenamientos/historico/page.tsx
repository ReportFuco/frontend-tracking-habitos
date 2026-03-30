import { EntrenamientosMenuLinks } from "@/modules/entrenamientos/components/menu-links"
import { HistoricoFuerza } from "@/modules/entrenamientos/components/historico-fuerza"
import { EntrenamientosProvider } from "@/modules/entrenamientos/hooks/useEntrenamientos"

export default function HistoricoEntrenamientosPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-4 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Historico de Entrenamientos</h1>
        <p className="text-sm text-muted-foreground">
          Revisa sesiones anteriores de fuerza y consulta el detalle de sus series.
        </p>
        <EntrenamientosMenuLinks />
      </header>

      <EntrenamientosProvider>
        <HistoricoFuerza />
      </EntrenamientosProvider>
    </main>
  )
}
