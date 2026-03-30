import { AdminMenu } from "@/components/admin/admin-menu"

export default function AdministradorEntrenamientosPage() {
  return (
    <AdminMenu
      title="Administrador > Entrenamientos"
      subtitle="Gestiona gimnasios, sesiones de fuerza y el historico de entrenamientos."
      items={[
        {
          title: "Iniciar Fuerza",
          description: "Abre una nueva sesion de entrenamiento de fuerza.",
          href: "/administrador/entrenamientos/iniciar-fuerza",
        },
        {
          title: "Entreno Activo",
          description: "Registra series, ajusta cargas y cierra la sesion actual.",
          href: "/administrador/entrenamientos/activo",
        },
        {
          title: "Historico",
          description: "Consulta sesiones anteriores y revisa sus series.",
          href: "/administrador/entrenamientos/historico",
        },
        {
          title: "Gimnasios",
          description: "CRUD de gimnasios usados por tus entrenamientos.",
          href: "/administrador/entrenamientos/gimnasios",
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
