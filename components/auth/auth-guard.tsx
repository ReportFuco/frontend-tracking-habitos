"use client"

import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"

interface AuthGuardProps {
  children: ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = "/usuarios" }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState<"checking" | "authorized" | "unauthorized">("checking")

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("auth_token") ?? localStorage.getItem("token")

      if (!token) {
        setStatus("unauthorized")
        const next = pathname ? `?next=${encodeURIComponent(pathname)}` : ""
        router.replace(`${redirectTo}${next}`)
        return
      }

      setStatus("authorized")
    }, 0)

    return () => clearTimeout(timer)
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
