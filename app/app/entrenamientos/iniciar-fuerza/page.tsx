import { EntrenamientosMenuLinks } from "@/modules/entrenamientos/components/menu-links"
import { EntrenoFuerzaFormCard } from "@/modules/entrenamientos/components/entreno-fuerza-form"
import { EntrenamientosProvider } from "@/modules/entrenamientos/hooks/useEntrenamientos"
import { PageHeader } from "@/components/shell/page-header"

export default function IniciarFuerzaPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Entrenamientos"
        title="Iniciar fuerza"
        description="Abre una nueva sesion y deja lista la captura de series."
      />
      <EntrenamientosMenuLinks />

      <EntrenamientosProvider>
        <EntrenoFuerzaFormCard />
      </EntrenamientosProvider>
    </div>
  )
}
