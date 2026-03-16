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
          title: "Usuarios",
          description: "Gestion y autenticacion de usuarios (en expansion).",
          href: "/usuarios",
        },
      ]}
    />
  )
}
