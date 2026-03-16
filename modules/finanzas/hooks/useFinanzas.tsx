"use client"

import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { FinanzasAPI } from "@/modules/finanzas/api/finanzas.api"
import {
  BancoResponse,
  CategoriaResponse,
  CuentaCreate,
  CuentaResponse,
  MovimientoCreate,
  MovimientoResponse,
} from "@/modules/finanzas/types/finanzas"

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.detail ?? error.message
  }

  return "Ocurrio un error inesperado."
}

export const useFinanzas = () => {
  const [bancos, setBancos] = useState<BancoResponse[]>([])
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([])
  const [cuentas, setCuentas] = useState<CuentaResponse[]>([])
  const [movimientos, setMovimientos] = useState<MovimientoResponse[]>([])

  const [loadingCatalogos, setLoadingCatalogos] = useState(false)
  const [submittingCuenta, setSubmittingCuenta] = useState(false)
  const [submittingMovimiento, setSubmittingMovimiento] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCatalogos = async () => {
    setLoadingCatalogos(true)
    setError(null)

    try {
      const [bancosResponse, categoriasResponse, cuentasResponse, movimientosResponse] =
        await Promise.all([
          FinanzasAPI.getBancos(),
          FinanzasAPI.getCategorias(),
          FinanzasAPI.getCuentas(),
          FinanzasAPI.getMovimientos(),
        ])

      setBancos(bancosResponse)
      setCategorias(categoriasResponse)
      setCuentas(cuentasResponse)
      setMovimientos(movimientosResponse)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoadingCatalogos(false)
    }
  }

  const crearCuenta = async (payload: CuentaCreate) => {
    setSubmittingCuenta(true)
    setError(null)

    try {
      await FinanzasAPI.createCuenta(payload)
      await fetchCatalogos()
      return { ok: true as const }
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      return { ok: false as const, message }
    } finally {
      setSubmittingCuenta(false)
    }
  }

  const crearMovimiento = async (payload: MovimientoCreate) => {
    setSubmittingMovimiento(true)
    setError(null)

    try {
      await FinanzasAPI.createMovimiento(payload)
      await fetchCatalogos()
      return { ok: true as const }
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      return { ok: false as const, message }
    } finally {
      setSubmittingMovimiento(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchCatalogos()
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  return {
    bancos,
    categorias,
    cuentas,
    movimientos,
    loadingCatalogos,
    submittingCuenta,
    submittingMovimiento,
    error,
    fetchCatalogos,
    crearCuenta,
    crearMovimiento,
  }
}
