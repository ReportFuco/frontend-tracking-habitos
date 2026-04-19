import { PageHeader } from "@/components/shell/page-header"
import { NutricionProvider } from "@/modules/nutricion/hooks/useNutricion"
import { NutricionMenuLinks } from "@/modules/nutricion/components/menu-links"
import { NutricionHomeOverview } from "@/modules/nutricion/components/nutricion-home-overview"

export default function NutricionPage() {
  return (
    <div className="flex flex-col gap-5">
      <NutricionMenuLinks />
      <PageHeader
        eyebrow="Modulo"
        title="Nutricion"
        description="Peso, consumos y metas nutricionales en un mismo espacio."
      />

      <NutricionProvider>
        <NutricionHomeOverview />
      </NutricionProvider>
    </div>
  )
}
