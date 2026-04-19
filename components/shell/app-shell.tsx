"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthAPI } from "@/modules/auth/api/auth.api"
import type { UsuarioProfile } from "@/modules/auth/types/auth"
import { cn } from "@/lib/utils"
import { MobileBottomNav } from "./mobile-bottom-nav"
import { SidebarNav } from "./sidebar-nav"
import { Topbar } from "./topbar"
import { adminNavSections, userNavSections, type NavSection } from "./nav-items"

interface AppShellProps {
  children: React.ReactNode
  variant?: "user" | "admin"
  sections?: NavSection[]
}

export function AppShell({ children, variant = "user", sections }: AppShellProps) {
  const [profile, setProfile] = useState<UsuarioProfile | null>(null)
  const [open, setOpen] = useState(false)

  const navSections = sections ?? (variant === "admin" ? adminNavSections : userNavSections)
  const mobileNavItems = navSections.flatMap((section) => section.items)
  const usesMobileBottomNav = variant === "user"
  const asideClassName = usesMobileBottomNav
    ? "hidden w-72 shrink-0 bg-[color:var(--sidebar)] md:sticky md:top-0 md:z-10 md:flex md:h-screen md:flex-col"
    : cn(
        "fixed inset-y-0 left-0 z-40 w-72 shrink-0 bg-[color:var(--sidebar)] transition-transform duration-200 md:sticky md:top-0 md:z-10 md:flex md:h-screen md:flex-col md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )

  useEffect(() => {
    const timer = setTimeout(() => {
      void AuthAPI.getProfile()
        .then(setProfile)
        .catch(() => setProfile(null))
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1400px]">
        <aside className={asideClassName} aria-label="Navegacion principal">
          <div className="flex h-16 items-center justify-between px-5">
            <span className="font-semibold tracking-tight">Atelier</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menu"
            >
              <X className="size-5" />
            </Button>
          </div>
          <SidebarNav sections={navSections} onNavigate={() => setOpen(false)} />
        </aside>

        {open ? (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            profile={profile}
            onMenu={() => setOpen(true)}
            variant={variant}
            showMenuButton={!usesMobileBottomNav}
          />
          <main className="flex-1 px-4 py-6 pb-24 sm:px-8 sm:py-10 sm:pb-10">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>

      {usesMobileBottomNav ? <MobileBottomNav items={mobileNavItems} /> : null}
    </div>
  )
}
