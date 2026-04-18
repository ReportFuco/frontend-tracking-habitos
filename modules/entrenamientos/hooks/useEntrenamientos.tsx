"use client"

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { AxiosError } from "axios"
import { getFriendlyErrorMessage } from "@/lib/error-messages"
import { EntrenamientosAPI } from "@/modules/entrenamientos/api/entrenamientos.api"
import {
  EntrenoFuerzaCreate,
  EntrenoFuerzaResponse,
  EntrenoFuerzaSerieResponse,
  GimnasioCreate,
  GimnasioEdit,
  GimnasioResponse,
  SerieFuerzaCreate,
  SerieFuerzaPatch,
} from "@/modules/entrenamientos/types/entrenamientos"

type EntrenamientosContextValue = ReturnType<typeof useEntrenamientosState>

const EntrenamientosContext = createContext<EntrenamientosContextValue | null>(null)

const useEntrenamientosState = () => {
  const [gimnasios, setGimnasios] = useState<GimnasioResponse[]>([])
  const [entrenamientosFuerza, setEntrenamientosFuerza] = useState<EntrenoFuerzaResponse[]>([])
  const [entrenamientoActivo, setEntrenamientoActivo] = useState<EntrenoFuerzaSerieResponse | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEntrenamientoActivo = useCallback(async () => {
    try {
      const data = await EntrenamientosAPI.getEntrenoFuerzaActivo()
      setEntrenamientoActivo(data)
      return data
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        setEntrenamientoActivo(null)
        return null
      }

      throw err
    }
  }, [])

  const fetchResumen = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [gimnasiosData, entrenamientosData] = await Promise.all([
        EntrenamientosAPI.getGimnasios(),
        EntrenamientosAPI.getEntrenosFuerza(),
      ])

      setGimnasios(gimnasiosData)
      setEntrenamientosFuerza(entrenamientosData)
      await fetchEntrenamientoActivo()
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [fetchEntrenamientoActivo])

  const fetchGimnasios = useCallback(async (q?: string) => {
    setLoading(true)
    setError(null)

    try {
      const data = await EntrenamientosAPI.getGimnasios(q)
      setGimnasios(data)
      return data
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchDetalleEntrenoFuerza = useCallback(async (idEntrenamientoFuerza: number) => {
    setLoading(true)
    setError(null)

    try {
      return await EntrenamientosAPI.getEntrenoFuerzaDetalle(idEntrenamientoFuerza)
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const runAction = useCallback(async (action: () => Promise<unknown>, shouldRefresh = true) => {
    setSubmitting(true)
    setError(null)

    try {
      await action()

      if (shouldRefresh) {
        await fetchResumen()
      }

      return { ok: true as const }
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
      setError(message)
      return { ok: false as const, message }
    } finally {
      setSubmitting(false)
    }
  }, [fetchResumen])

  const crearGimnasio = useCallback(
    async (payload: GimnasioCreate) => runAction(() => EntrenamientosAPI.createGimnasio(payload)),
    [runAction]
  )

  const editarGimnasio = useCallback(
    async (idGimnasio: number, payload: GimnasioEdit) =>
      runAction(() => EntrenamientosAPI.updateGimnasio(idGimnasio, payload)),
    [runAction]
  )

  const eliminarGimnasio = useCallback(
    async (idGimnasio: number) => runAction(() => EntrenamientosAPI.deleteGimnasio(idGimnasio)),
    [runAction]
  )

  const iniciarEntrenoFuerza = useCallback(
    async (payload: EntrenoFuerzaCreate) =>
      runAction(() => EntrenamientosAPI.createEntrenoFuerza(payload)),
    [runAction]
  )

  const cerrarEntrenoFuerzaActivo = useCallback(
    async () => runAction(() => EntrenamientosAPI.closeEntrenoFuerzaActivo()),
    [runAction]
  )

  const agregarSerieFuerza = useCallback(
    async (payload: SerieFuerzaCreate) => runAction(() => EntrenamientosAPI.createSerieFuerza(payload)),
    [runAction]
  )

  const editarSerieFuerza = useCallback(
    async (idFuerzaDetalle: number, payload: SerieFuerzaPatch) =>
      runAction(() => EntrenamientosAPI.updateSerieFuerza(idFuerzaDetalle, payload)),
    [runAction]
  )

  const eliminarSerieFuerza = useCallback(
    async (idFuerzaDetalle: number) =>
      runAction(() => EntrenamientosAPI.deleteSerieFuerza(idFuerzaDetalle)),
    [runAction]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchResumen()
    }, 0)

    return () => clearTimeout(timer)
  }, [fetchResumen])

  return {
    gimnasios,
    entrenamientosFuerza,
    entrenamientoActivo,
    loading,
    submitting,
    error,
    fetchResumen,
    fetchGimnasios,
    fetchEntrenamientoActivo,
    fetchDetalleEntrenoFuerza,
    crearGimnasio,
    editarGimnasio,
    eliminarGimnasio,
    iniciarEntrenoFuerza,
    cerrarEntrenoFuerzaActivo,
    agregarSerieFuerza,
    editarSerieFuerza,
    eliminarSerieFuerza,
  }
}

export function EntrenamientosProvider({ children }: { children: ReactNode }) {
  const value = useEntrenamientosState()

  return <EntrenamientosContext.Provider value={value}>{children}</EntrenamientosContext.Provider>
}

export const useEntrenamientos = () => {
  const context = useContext(EntrenamientosContext)

  if (!context) {
    throw new Error("useEntrenamientos debe usarse dentro de un EntrenamientosProvider")
  }

  return context
}
