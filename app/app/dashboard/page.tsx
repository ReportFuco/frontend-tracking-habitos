import { ComingSoon } from "@/components/shell/coming-soon"

export default function DashboardPage() {
  return (
    <ComingSoon
      eyebrow="Inicio"
      title="Dashboard"
      description="Tu resumen diario consolidado: finanzas, entrenamientos, compras y nutricion."
      bullets={[
        "Resumen financiero del mes con saldos por cuenta",
        "Estado del entrenamiento activo y ultimas sesiones",
        "Compras recientes y gastos por local",
        "Peso reciente, metas diarias y consumos del dia",
      ]}
    />
  )
}
