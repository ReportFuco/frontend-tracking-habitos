import Link from "next/link"

export function FinanzasMenuLinks() {
  const links = [
    { href: "/administrador/finanzas", label: "Menu Finanzas" },
    { href: "/administrador/finanzas/registrar-cuenta", label: "Registrar Cuenta" },
    { href: "/administrador/finanzas/registrar-movimiento", label: "Registrar Movimiento" },
    { href: "/administrador/finanzas/historico", label: "Ver Historico" },
    { href: "/administrador/finanzas/bancos", label: "Bancos" },
    { href: "/administrador/finanzas/categorias", label: "Categorias" },
    { href: "/administrador/finanzas/cuentas", label: "Cuentas" },
    { href: "/administrador/finanzas/movimientos", label: "Movimientos" },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex h-9 items-center justify-center rounded-md border border-input px-3 text-sm font-medium"
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
