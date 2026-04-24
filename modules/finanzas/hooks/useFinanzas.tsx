"use client"

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { getFriendlyErrorMessage } from "@/lib/error-messages"
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
  ProductoFinancieroResponse,
} from "@/modules/finanzas/types/finanzas"

const MOVIMIENTOS_LIMIT = 20

type FinanzasContextValue = ReturnType<typeof useFinanzasState>

const FinanzasContext = createContext<FinanzasContextValue | null>(null)

const useFinanzasState = () => {
  const [bancos, setBancos] = useState<BancoResponse[]>([])
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([])
  const [cuentas, setCuentas] = useState<CuentaResponse[]>([])
  const [movimientos, setMovimientos] = useState<MovimientoResponse[]>([])
  const [totalGastoMensual, setTotalGastoMensual] = useState(0)
  const [hasMoreMovimientos, setHasMoreMovimientos] = useState(false)
  const [loadingMoreMovimientos, setLoadingMoreMovimientos] = useState(false)

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
          FinanzasAPI.getMovimientos({ limit: MOVIMIENTOS_LIMIT }),
        ])

      if (bancosResult.status === "fulfilled") setBancos(bancosResult.value)
      if (categoriasResult.status === "fulfilled") setCategorias(categoriasResult.value)
      if (cuentasResult.status === "fulfilled") setCuentas(cuentasResult.value)
      if (movimientosResult.status === "fulfilled") {
        const page = movimientosResult.value
        setMovimientos(page.items)
        setTotalGastoMensual(page.total_gasto_mensual)
        setHasMoreMovimientos(page.items.length === MOVIMIENTOS_LIMIT)
      }

      const failures = [bancosResult, categoriasResult, cuentasResult, movimientosResult].filter(
        (item) => item.status === "rejected"
      )

      if (failures.length > 0) {
        const firstFailure = failures[0] as PromiseRejectedResult
        const message = getFriendlyErrorMessage(firstFailure.reason)
        setError(message)
        toast.error("No pudimos cargar tus datos", { description: message })
      }
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
      setError(message)
      toast.error("No pudimos cargar tus datos", { description: message })
    } finally {
      setLoadingCatalogos(false)
    }
  }

  const loadMoreMovimientos = useCallback(async () => {
    setLoadingMoreMovimientos(true)
    try {
      const page = await FinanzasAPI.getMovimientos({
        offset: movimientos.length,
        limit: MOVIMIENTOS_LIMIT,
      })
      setMovimientos((prev) => [...prev, ...page.items])
      setTotalGastoMensual(page.total_gasto_mensual)
      setHasMoreMovimientos(page.items.length === MOVIMIENTOS_LIMIT)
    } catch (err) {
      toast.error("No se pudieron cargar más movimientos", {
        description: getFriendlyErrorMessage(err),
      })
    } finally {
      setLoadingMoreMovimientos(false)
    }
  }, [movimientos.length])

  const runAction = async (action: () => Promise<unknown>) => {
    setError(null)
    try {
      await action()
      await fetchCatalogos()
      return { ok: true as const }
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
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

  const getProductosByBanco = useCallback(
    async (idBanco: number): Promise<ProductoFinancieroResponse[]> => {
      try {
        return await FinanzasAPI.getProductosFinancieros({ id_banco: idBanco })
      } catch (err) {
        toast.error("No pudimos cargar los productos del banco", {
          description: getFriendlyErrorMessage(err),
        })
        return []
      }
    },
    []
  )

  useEffect(() => {
    const timer = setTimeout(() => { void fetchCatalogos() }, 0)
    return () => clearTimeout(timer)
  }, [])

  return {
    bancos,
    categorias,
    cuentas,
    movimientos,
    totalGastoMensual,
    hasMoreMovimientos,
    loadingMoreMovimientos,
    loadingCatalogos,
    submittingCuenta,
    submittingMovimiento,
    error,
    fetchCatalogos,
    loadMoreMovimientos,
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
    getProductosByBanco,
  }
}

export function FinanzasProvider({ children }: { children: ReactNode }) {
  const value = useFinanzasState()
  return <FinanzasContext.Provider value={value}>{children}</FinanzasContext.Provider>
}

export const useFinanzas = () => {
  const context = useContext(FinanzasContext)
  if (!context) throw new Error("useFinanzas debe usarse dentro de un FinanzasProvider")
  return context
}
