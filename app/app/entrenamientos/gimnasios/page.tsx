import { EntrenamientosMenuLinks } from "@/modules/entrenamientos/components/menu-links"
import { GimnasiosDirectory } from "@/modules/entrenamientos/components/gimnasios-directory"
import { EntrenamientosProvider } from "@/modules/entrenamientos/hooks/useEntrenamientos"
import { PageHeader } from "@/components/shell/page-header"

export default function GimnasiosEntrenamientosUserPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Entrenamientos"
        title="Gimnasios"
        description="Consulta los gimnasios disponibles para elegir mejor el contexto de tu proxima sesion."
      />
      <EntrenamientosMenuLinks />

      <EntrenamientosProvider>
        <GimnasiosDirectory />
      </EntrenamientosProvider>
    </div>
  )
}
