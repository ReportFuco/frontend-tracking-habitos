"use client"

import { ReactNode } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AdministradorLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}
