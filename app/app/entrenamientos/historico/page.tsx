import { EntrenamientosMenuLinks } from "@/modules/entrenamientos/components/menu-links"
import { HistoricoFuerza } from "@/modules/entrenamientos/components/historico-fuerza"
import { EntrenamientosProvider } from "@/modules/entrenamientos/hooks/useEntrenamientos"
import { PageHeader } from "@/components/shell/page-header"

export default function HistoricoEntrenamientosPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Entrenamientos"
        title="Historico"
        description="Revisa sesiones anteriores y consulta el detalle de sus series."
      />
      <EntrenamientosMenuLinks />

      <EntrenamientosProvider>
        <HistoricoFuerza />
      </EntrenamientosProvider>
    </div>
  )
}
