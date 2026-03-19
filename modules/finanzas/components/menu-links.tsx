"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function FinanzasMenuLinks() {
  const pathname = usePathname()
  const finanzasRootPath = "/administrador/finanzas"
  const showBackToMenu = pathname !== finanzasRootPath

  const links = [
    { href: "/administrador/finanzas/registrar-cuenta", label: "Registrar Cuenta" },
    { href: "/administrador/finanzas/registrar-movimiento", label: "Registrar Movimiento" },
    { href: "/administrador/finanzas/historico", label: "Ver Historico" },
    { href: "/administrador/finanzas/bancos", label: "Bancos" },
    { href: "/administrador/finanzas/categorias", label: "Categorias" },
    { href: "/administrador/finanzas/cuentas", label: "Cuentas" },
    { href: "/administrador/finanzas/movimientos", label: "Movimientos" },
  ]

  return (
    <div className="space-y-2">
      {showBackToMenu ? (
        <Link
          href={finanzasRootPath}
          className="inline-flex h-9 items-center justify-center rounded-md border border-input px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        >
          Volver al menu de finanzas
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
