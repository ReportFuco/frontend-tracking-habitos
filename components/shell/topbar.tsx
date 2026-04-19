"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Menu } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { clearStoredSession } from "@/lib/auth-session"
import { AuthAPI } from "@/modules/auth/api/auth.api"
import type { UsuarioProfile } from "@/modules/auth/types/auth"

interface TopbarProps {
  profile: UsuarioProfile | null
  onMenu: () => void
  variant?: "user" | "admin"
  showMenuButton?: boolean
}

export function Topbar({
  profile,
  onMenu,
  variant = "user",
  showMenuButton = true,
}: TopbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await AuthAPI.logout()
    } catch {
      // sesion local se limpia igualmente
    }
    clearStoredSession()
    toast.success("Sesion cerrada")
    router.replace("/login")
  }

  const initials = profile
    ? `${profile.nombre?.[0] ?? ""}${profile.apellido?.[0] ?? ""}`.toUpperCase() || "?"
    : "?"

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-[color:var(--background)]/85 px-4 backdrop-blur-md sm:px-6">
      {showMenuButton ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenu}
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </Button>
      ) : null}

      <div className="flex items-center gap-2">
        <Link
          href={variant === "admin" ? "/administrador" : "/app/dashboard"}
          className="font-semibold tracking-tight"
        >
          <span className="text-foreground">The Curated Life</span>
          {variant === "admin" ? (
            <span className="ml-2 rounded-md bg-[color:var(--tertiary-container)] px-2 py-0.5 font-[family-name:var(--font-label)] text-[0.65rem] uppercase tracking-wider text-[color:var(--tertiary)]">
              admin
            </span>
          ) : null}
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {profile ? (
          <div className="hidden items-center gap-3 sm:flex">
            {variant === "user" && profile.is_superuser ? (
              <Link
                href="/administrador"
                className="rounded-full bg-[color:var(--surface-low)] px-3 py-2 font-[family-name:var(--font-label)] text-[0.7rem] uppercase tracking-wider text-foreground transition hover:bg-[color:var(--surface-variant)]"
              >
                Panel admin
              </Link>
            ) : null}
            <div className="text-right">
              <p className="text-sm font-medium leading-tight">
                {profile.nombre} {profile.apellido}
              </p>
              <p className="font-[family-name:var(--font-label)] text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                @{profile.username}
              </p>
            </div>
            <span
              className="flex size-9 items-center justify-center rounded-full bg-[color:var(--primary)] font-[family-name:var(--font-label)] text-xs font-medium text-[color:var(--primary-foreground)]"
              aria-hidden
            >
              {initials}
            </span>
          </div>
        ) : null}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          aria-label="Cerrar sesion"
          title="Cerrar sesion"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  )
}
