import { AdminMenu } from "@/components/admin/admin-menu"

export default function AdministradorPage() {
  return (
    <AdminMenu
      title="Panel Administrador"
      subtitle="Accede a las funciones principales por modulo, separadas por flujo de trabajo."
      items={[
        {
          title: "Finanzas",
          description: "Registrar cuentas, registrar movimientos y revisar historico.",
          href: "/administrador/finanzas",
        },
        {
          title: "Entrenamientos",
          description: "Gestion de gimnasios, sesiones de fuerza y seguimiento de series.",
          href: "/administrador/entrenamientos",
        },
        {
          title: "Usuarios",
          description: "Gestion y autenticacion de usuarios (en expansion).",
          href: "/usuarios",
        },
      ]}
    />
  )
}
