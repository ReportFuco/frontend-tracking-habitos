import { AdminMenu } from "@/components/admin/admin-menu"

export default function FinanzasPage() {
  return (
    <AdminMenu
      title="Finanzas"
      subtitle="Esta ruta ahora funciona como menu del modulo para mantener el proyecto ordenado."
      items={[
        {
          title: "Registrar Cuenta",
          description: "Crear una cuenta bancaria nueva.",
          href: "/administrador/finanzas/registrar-cuenta",
        },
        {
          title: "Registrar Movimiento",
          description: "Ingresar un gasto o ingreso.",
          href: "/administrador/finanzas/registrar-movimiento",
        },
        {
          title: "Ver Historico",
          description: "Consultar cuentas y movimientos cargados.",
          href: "/administrador/finanzas/historico",
        },
        {
          title: "Ir al Panel Admin",
          description: "Volver al menu principal del administrador.",
          href: "/administrador",
        },
      ]}
    />
  )
}
