"use client"

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { getFriendlyErrorMessage } from "@/lib/error-messages"
import { ComprasAPI } from "@/modules/compras/api/compras.api"
import {
  CadenaResponse,
  CompraCreate,
  CompraPatch,
  CompraResponse,
  LocalResponse,
} from "@/modules/compras/types/compras"

type ComprasContextValue = ReturnType<typeof useComprasState>

const ComprasContext = createContext<ComprasContextValue | null>(null)

const useComprasState = () => {
  const [cadenas, setCadenas] = useState<CadenaResponse[]>([])
  const [locales, setLocales] = useState<LocalResponse[]>([])
  const [compras, setCompras] = useState<CompraResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchResumen = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [cadenasRes, localesRes, comprasRes] = await Promise.allSettled([
        ComprasAPI.getCadenas(),
        ComprasAPI.getLocales(),
        ComprasAPI.getCompras(),
      ])
      if (cadenasRes.status === "fulfilled") setCadenas(cadenasRes.value)
      if (localesRes.status === "fulfilled") setLocales(localesRes.value)
      if (comprasRes.status === "fulfilled") setCompras(comprasRes.value)

      const failure = [cadenasRes, localesRes, comprasRes].find((r) => r.status === "rejected")
      if (failure) {
        setError(getFriendlyErrorMessage((failure as PromiseRejectedResult).reason))
      }
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const runAction = useCallback(
    async (action: () => Promise<unknown>) => {
      setSubmitting(true)
      setError(null)
      try {
        await action()
        await fetchResumen()
        return { ok: true as const }
      } catch (err) {
        const message = getFriendlyErrorMessage(err)
        setError(message)
        return { ok: false as const, message }
      } finally {
        setSubmitting(false)
      }
    },
    [fetchResumen]
  )

  const crearCompra = (payload: CompraCreate) =>
    runAction(() => ComprasAPI.createCompra(payload))

  const editarCompra = (idCompra: number, payload: CompraPatch) =>
    runAction(() => ComprasAPI.updateCompra(idCompra, payload))

  const eliminarCompra = (idCompra: number) =>
    runAction(() => ComprasAPI.deleteCompra(idCompra))

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchResumen()
    }, 0)
    return () => clearTimeout(timer)
  }, [fetchResumen])

  return {
    cadenas,
    locales,
    compras,
    loading,
    submitting,
    error,
    fetchResumen,
    crearCompra,
    editarCompra,
    eliminarCompra,
  }
}

export function ComprasProvider({ children }: { children: ReactNode }) {
  const value = useComprasState()

  useEffect(() => {
    if (value.error) {
      toast.error("Error cargando compras", { description: value.error })
    }
  }, [value.error])

  return <ComprasContext.Provider value={value}>{children}</ComprasContext.Provider>
}

export const useCompras = () => {
  const ctx = useContext(ComprasContext)
  if (!ctx) throw new Error("useCompras debe usarse dentro de un ComprasProvider")
  return ctx
}
