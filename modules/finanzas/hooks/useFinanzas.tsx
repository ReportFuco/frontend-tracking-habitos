"use client"

import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { FinanzasAPI } from "@/modules/finanzas/api/finanzas.api"
import {
  BancoCreate,
  BancoResponse,
  CategoriaCreate,
  CategoriaPatch,
  CategoriaResponse,
  CuentaCreate,
  CuentaPatch,
  CuentaResponse,
  MovimientoCreate,
  MovimientoPatch,
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
      const [bancosResult, categoriasResult, cuentasResult, movimientosResult] =
        await Promise.allSettled([
          FinanzasAPI.getBancos(),
          FinanzasAPI.getCategorias(),
          FinanzasAPI.getCuentas(),
          FinanzasAPI.getMovimientos(),
        ])

      if (bancosResult.status === "fulfilled") setBancos(bancosResult.value)
      if (categoriasResult.status === "fulfilled") setCategorias(categoriasResult.value)
      if (cuentasResult.status === "fulfilled") setCuentas(cuentasResult.value)
      if (movimientosResult.status === "fulfilled") setMovimientos(movimientosResult.value)

      const failures = [bancosResult, categoriasResult, cuentasResult, movimientosResult].filter(
        (item) => item.status === "rejected"
      )

      if (failures.length > 0) {
        const firstFailure = failures[0] as PromiseRejectedResult
        setError(getErrorMessage(firstFailure.reason))
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoadingCatalogos(false)
    }
  }

  const runAction = async (action: () => Promise<unknown>) => {
    setError(null)

    try {
      await action()
      await fetchCatalogos()
      return { ok: true as const }
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      return { ok: false as const, message }
    }
  }

  const crearBanco = async (payload: BancoCreate) => runAction(() => FinanzasAPI.createBanco(payload))

  const editarBanco = async (idBanco: number, payload: BancoCreate) =>
    runAction(() => FinanzasAPI.updateBanco(idBanco, payload))

  const eliminarBanco = async (idBanco: number) => runAction(() => FinanzasAPI.deleteBanco(idBanco))

  const crearCategoria = async (payload: CategoriaCreate) =>
    runAction(() => FinanzasAPI.createCategoria(payload))

  const editarCategoria = async (idCategoria: number, payload: CategoriaPatch) =>
    runAction(() => FinanzasAPI.updateCategoria(idCategoria, payload))

  const eliminarCategoria = async (idCategoria: number) =>
    runAction(() => FinanzasAPI.deleteCategoria(idCategoria))

  const crearCuenta = async (payload: CuentaCreate) => {
    setSubmittingCuenta(true)
    const result = await runAction(() => FinanzasAPI.createCuenta(payload))
    setSubmittingCuenta(false)
    return result
  }

  const editarCuenta = async (idCuenta: number, payload: CuentaPatch) =>
    runAction(() => FinanzasAPI.updateCuenta(idCuenta, payload))

  const eliminarCuenta = async (idCuenta: number) => runAction(() => FinanzasAPI.deleteCuenta(idCuenta))

  const crearMovimiento = async (payload: MovimientoCreate) => {
    setSubmittingMovimiento(true)
    const result = await runAction(() => FinanzasAPI.createMovimiento(payload))
    setSubmittingMovimiento(false)
    return result
  }

  const editarMovimiento = async (idMovimiento: number, payload: MovimientoPatch) =>
    runAction(() => FinanzasAPI.updateMovimiento(idMovimiento, payload))

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
    crearBanco,
    editarBanco,
    eliminarBanco,
    crearCategoria,
    editarCategoria,
    eliminarCategoria,
    crearCuenta,
    editarCuenta,
    eliminarCuenta,
    crearMovimiento,
    editarMovimiento,
  }
}
