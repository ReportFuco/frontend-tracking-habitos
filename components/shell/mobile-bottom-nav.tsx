"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { NavItem } from "./nav-items"

interface MobileBottomNavProps {
  items: NavItem[]
}

export function MobileBottomNav({ items }: MobileBottomNavProps) {
  const pathname = usePathname() ?? ""
  const preferredOrder = [
    "/app/dashboard",
    "/app/finanzas",
    "/app/entrenamientos",
    "/app/nutricion",
    "/app/compras",
  ]
  const visibleItems = preferredOrder
    .map((href) => items.find((item) => item.href === href))
    .filter((item): item is NavItem => Boolean(item))

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--border)]/30 bg-background/88 px-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 backdrop-blur-xl md:hidden">
      <ul className="mx-auto flex max-w-md items-end justify-between gap-1.5">
        {visibleItems.map((item) => {
          const isActive =
            item.href === "/app/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-[1rem] px-1.5 py-1.5 text-[9px] font-medium tracking-[0.01em] transition-all",
                  isActive
                    ? "bg-[color:var(--surface-lowest)] text-foreground shadow-[var(--shadow-airy)]"
                    : "text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full transition-colors",
                    isActive ? "bg-[color:var(--accent)]" : "bg-transparent"
                  )}
                  style={item.moduleColor && isActive ? { color: item.moduleColor } : undefined}
                >
                  <Icon className="size-4" />
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
