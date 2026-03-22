"use client"

import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import { getValidStoredToken } from "@/lib/auth-session"
import { AuthAPI } from "@/modules/auth/api/auth.api"

interface AuthGuardProps {
  children: ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = "/usuarios" }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState<"checking" | "authorized" | "unauthorized">("checking")

  useEffect(() => {
    const validateSession = async () => {
      const token = getValidStoredToken()

      if (!token) {
        setStatus("unauthorized")
        const next = pathname ? `?next=${encodeURIComponent(pathname)}` : ""
        router.replace(`${redirectTo}${next}`)
        return
      }

      try {
        await AuthAPI.getProfile()
        setStatus("authorized")
      } catch {
        setStatus("unauthorized")
        const next = pathname ? `?next=${encodeURIComponent(pathname)}` : ""
        router.replace(`${redirectTo}${next}`)
      }
    }

    void validateSession()
  }, [pathname, redirectTo, router])

  if (status !== "authorized") {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Validando sesion...</p>
      </main>
    )
  }

  return <>{children}</>
}
