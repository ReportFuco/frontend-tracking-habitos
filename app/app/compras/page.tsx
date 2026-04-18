import { ComingSoon } from "@/components/shell/coming-soon"

export default function ComprasPage() {
  return (
    <ComingSoon
      eyebrow="Modulo"
      title="Compras"
      description="Registra tus compras con su detalle, local y lista de productos."
      accentColor="var(--module-compras)"
      bullets={[
        "Nueva compra con monto total y local",
        "Detalle por producto, marca y precio",
        "Historico de compras y filtros por cadena / local",
      ]}
    />
  )
}
