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
  const activeIndex = visibleItems.findIndex((item) =>
    item.href === "/app/dashboard"
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  )
  const normalizedActiveIndex = activeIndex >= 0 ? activeIndex : 0
  const indicatorWidth = visibleItems.length > 0 ? `${100 / visibleItems.length}%` : "0%"

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--border)]/30 bg-background/88 px-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 backdrop-blur-xl lg:hidden">
      <div className="relative mx-auto max-w-md">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 rounded-[1rem] bg-[color:var(--surface-lowest)] shadow-[var(--shadow-airy)] transition-transform duration-300 ease-out"
          style={{
            width: indicatorWidth,
            transform: `translateX(${normalizedActiveIndex * 100}%)`,
          }}
        />
        <ul
          className="relative grid items-end"
          style={{ gridTemplateColumns: `repeat(${Math.max(visibleItems.length, 1)}, minmax(0, 1fr))` }}
        >
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
                    "relative z-10 flex flex-col items-center justify-center gap-0.5 rounded-[1rem] px-1.5 py-1.5 text-[9px] font-medium tracking-[0.01em] transition-colors duration-300 ease-out",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full transition-colors duration-300 ease-out",
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
      </div>
    </nav>
  )
}
