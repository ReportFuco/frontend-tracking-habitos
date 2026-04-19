"use client"

import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useEffect, useRef, useState } from "react"
import { getValidStoredToken } from "@/lib/auth-session"
import { AuthAPI } from "@/modules/auth/api/auth.api"

interface AuthGuardProps {
  children: ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const initialPathnameRef = useRef(pathname)
  const [status, setStatus] = useState<"checking" | "authorized" | "unauthorized">("checking")

  useEffect(() => {
    const validateSession = async () => {
      const token = getValidStoredToken()
      const next = initialPathnameRef.current
        ? `?next=${encodeURIComponent(initialPathnameRef.current)}`
        : ""

      if (!token) {
        setStatus("unauthorized")
        router.replace(`${redirectTo}${next}`)
        return
      }

      try {
        await AuthAPI.getProfile()
        setStatus("authorized")
      } catch {
        setStatus("unauthorized")
        router.replace(`${redirectTo}${next}`)
      }
    }

    void validateSession()
  }, [redirectTo, router])

  if (status !== "authorized") {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Validando sesion...</p>
      </main>
    )
  }

  return <>{children}</>
}
