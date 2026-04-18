import { ComingSoon } from "@/components/shell/coming-soon"

export default function NutricionPage() {
  return (
    <ComingSoon
      eyebrow="Modulo"
      title="Nutricion"
      description="Peso, consumos y metas nutricionales en un mismo espacio."
      accentColor="var(--module-nutricion)"
      bullets={[
        "Registro de peso corporal por fecha",
        "Consumo diario por producto y horario",
        "Metas nutricionales activas (kcal, proteina)",
        "Overview combinado con tendencias",
      ]}
    />
  )
}
