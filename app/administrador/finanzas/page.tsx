import { AdminMenu } from "@/components/admin/admin-menu"

export default function AdministradorFinanzasPage() {
  return (
    <AdminMenu
      title="Administrador > Finanzas"
      subtitle="Selecciona una accion especifica para trabajar en finanzas."
      items={[
        {
          title: "Registrar Cuenta",
          description: "Crea una cuenta bancaria para el usuario autenticado.",
          href: "/administrador/finanzas/registrar-cuenta",
        },
        {
          title: "Registrar Movimiento",
          description: "Registra gastos o ingresos asociados a una cuenta.",
          href: "/administrador/finanzas/registrar-movimiento",
        },
        {
          title: "Bancos",
          description: "CRUD de bancos.",
          href: "/administrador/finanzas/bancos",
        },
        {
          title: "Categorias",
          description: "CRUD de categorias.",
          href: "/administrador/finanzas/categorias",
        },
        {
          title: "Cuentas",
          description: "CRUD de cuentas.",
          href: "/administrador/finanzas/cuentas",
        },
        {
          title: "Movimientos",
          description: "CRUD de movimientos (sin delete en API actual).",
          href: "/administrador/finanzas/movimientos",
        },
        {
          title: "Ver Historico",
          description: "Consulta cuentas y movimientos registrados.",
          href: "/administrador/finanzas/historico",
        },
        {
          title: "Volver al Panel",
          description: "Regresa al menu principal de administrador.",
          href: "/administrador",
        },
      ]}
    />
  )
}
