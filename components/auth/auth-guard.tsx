"use client"

import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useEffect, useRef, useState } from "react"
import { FullScreenLoader } from "@/components/feedback/loaders/full-screen-loader"
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
    return <FullScreenLoader accent="olive" label="Validando acceso..." mode="session" />
  }

  return <>{children}</>
}
