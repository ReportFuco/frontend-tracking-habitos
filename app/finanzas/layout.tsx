"use client"

import { ReactNode } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function FinanzasLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}
