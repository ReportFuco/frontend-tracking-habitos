"use client"

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { getFriendlyErrorMessage } from "@/lib/error-messages"
import { NutricionAPI } from "@/modules/nutricion/api/nutricion.api"
import {
  ConsumoCreate,
  ConsumoPatch,
  ConsumoResponse,
  ConsumoDetalleCreate,
  ConsumoDetallePatch,
  MetaNutricionalCreate,
  MetaNutricionalPatch,
  MetaNutricionalResponse,
  PesoCreate,
  PesoPatch,
  PesoResponse,
  TablaNutricionalResponse,
} from "@/modules/nutricion/types/nutricion"

type NutricionContextValue = ReturnType<typeof useNutricionState>

const NutricionContext = createContext<NutricionContextValue | null>(null)

const useNutricionState = () => {
  const [consumos, setConsumos] = useState<ConsumoResponse[]>([])
  const [metas, setMetas] = useState<MetaNutricionalResponse[]>([])
  const [pesos, setPesos] = useState<PesoResponse[]>([])
  const [tablas, setTablas] = useState<TablaNutricionalResponse[]>([])

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchResumen = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [consumosResult, metasResult, pesosResult, tablasResult] = await Promise.allSettled([
        NutricionAPI.getConsumos(),
        NutricionAPI.getMetas(),
        NutricionAPI.getPesos(),
        NutricionAPI.getTablas(),
      ])

      if (consumosResult.status === "fulfilled") setConsumos(consumosResult.value)
      if (metasResult.status === "fulfilled") setMetas(metasResult.value)
      if (pesosResult.status === "fulfilled") setPesos(pesosResult.value)
      if (tablasResult.status === "fulfilled") setTablas(tablasResult.value)

      const failures = [consumosResult, metasResult, pesosResult, tablasResult].filter(
        (item) => item.status === "rejected"
      )

      if (failures.length > 0) {
        const firstFailure = failures[0] as PromiseRejectedResult
        const message = getFriendlyErrorMessage(firstFailure.reason)
        setError(message)
      }
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
      setError(message)
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

  const crearConsumo = (payload: ConsumoCreate) =>
    runAction(() => NutricionAPI.createConsumo(payload))

  const editarConsumo = (idConsumo: number, payload: ConsumoPatch) =>
    runAction(() => NutricionAPI.updateConsumo(idConsumo, payload))

  const eliminarConsumo = (idConsumo: number) =>
    runAction(() => NutricionAPI.deleteConsumo(idConsumo))

  const crearConsumoDetalle = (payload: ConsumoDetalleCreate) =>
    runAction(() => NutricionAPI.createConsumoDetalle(payload))

  const editarConsumoDetalle = (idDetalle: number, payload: ConsumoDetallePatch) =>
    runAction(() => NutricionAPI.updateConsumoDetalle(idDetalle, payload))

  const eliminarConsumoDetalle = (idDetalle: number) =>
    runAction(() => NutricionAPI.deleteConsumoDetalle(idDetalle))

  const crearMeta = (payload: MetaNutricionalCreate) =>
    runAction(() => NutricionAPI.createMeta(payload))

  const editarMeta = (idMeta: number, payload: MetaNutricionalPatch) =>
    runAction(() => NutricionAPI.updateMeta(idMeta, payload))

  const eliminarMeta = (idMeta: number) => runAction(() => NutricionAPI.deleteMeta(idMeta))

  const crearPeso = (payload: PesoCreate) => runAction(() => NutricionAPI.createPeso(payload))

  const editarPeso = (idPeso: number, payload: PesoPatch) =>
    runAction(() => NutricionAPI.updatePeso(idPeso, payload))

  const eliminarPeso = (idPeso: number) => runAction(() => NutricionAPI.deletePeso(idPeso))

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchResumen()
    }, 0)
    return () => clearTimeout(timer)
  }, [fetchResumen])

  return {
    consumos,
    metas,
    pesos,
    tablas,
    loading,
    submitting,
    error,
    fetchResumen,
    crearConsumo,
    editarConsumo,
    eliminarConsumo,
    crearConsumoDetalle,
    editarConsumoDetalle,
    eliminarConsumoDetalle,
    crearMeta,
    editarMeta,
    eliminarMeta,
    crearPeso,
    editarPeso,
    eliminarPeso,
  }
}

export function NutricionProvider({ children }: { children: ReactNode }) {
  const value = useNutricionState()

  useEffect(() => {
    if (value.error) {
      toast.error("Error cargando nutricion", { description: value.error })
    }
  }, [value.error])

  return <NutricionContext.Provider value={value}>{children}</NutricionContext.Provider>
}

export const useNutricion = () => {
  const ctx = useContext(NutricionContext)
  if (!ctx) throw new Error("useNutricion debe usarse dentro de un NutricionProvider")
  return ctx
}
