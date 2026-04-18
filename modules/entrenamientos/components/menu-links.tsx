"use client"

import { usePathname } from "next/navigation"
import { ContextNav } from "@/components/shell/context-nav"

export function EntrenamientosMenuLinks() {
  const pathname = usePathname()
  const currentLabel =
    pathname === "/app/entrenamientos/iniciar-fuerza"
      ? "Iniciar fuerza"
      : pathname === "/app/entrenamientos/activo"
        ? "Entrenamiento activo"
        : pathname === "/app/entrenamientos/historico"
          ? "Historico"
          : "Resumen"

  return (
    <ContextNav
      crumbs={[
        { label: "Inicio", href: "/app/dashboard" },
        { label: "Entrenamientos", href: "/app/entrenamientos" },
        ...(pathname === "/app/entrenamientos" ? [] : [{ label: currentLabel }]),
      ]}
    />
  )
}
