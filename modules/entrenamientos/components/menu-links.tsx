"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function EntrenamientosMenuLinks() {
  const pathname = usePathname()
  const rootPath = "/administrador/entrenamientos"
  const showBackToMenu = pathname !== rootPath

  const links = [
    { href: "/administrador/entrenamientos/iniciar-fuerza", label: "Iniciar Fuerza" },
    { href: "/administrador/entrenamientos/activo", label: "Entreno Activo" },
    { href: "/administrador/entrenamientos/historico", label: "Historico" },
    { href: "/administrador/entrenamientos/gimnasios", label: "Gimnasios" },
  ]

  return (
    <div className="space-y-2">
      {showBackToMenu ? (
        <Link
          href={rootPath}
          className="inline-flex h-9 items-center justify-center rounded-md border border-input px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        >
          Volver al menu de entrenamientos
        </Link>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-border bg-muted text-foreground"
                  : "border-input text-foreground hover:bg-muted/60"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
