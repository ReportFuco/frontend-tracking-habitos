import { api } from "@/lib/api"
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

export const FinanzasAPI = {
  getBancos: async (): Promise<BancoResponse[]> => {
    const { data } = await api.get("/api/finanzas/banco/")
    return data
  },

  createBanco: async (payload: BancoCreate): Promise<BancoResponse> => {
    const { data } = await api.post("/api/finanzas/banco/", payload)
    return data
  },

  updateBanco: async (idBanco: number, payload: BancoCreate): Promise<BancoResponse> => {
    const { data } = await api.patch(`/api/finanzas/banco/${idBanco}`, payload)
    return data
  },

  deleteBanco: async (idBanco: number): Promise<void> => {
    await api.delete(`/api/finanzas/banco/${idBanco}`)
  },

  getCategorias: async (): Promise<CategoriaResponse[]> => {
    const { data } = await api.get("/api/finanzas/categoria/")
    return data
  },

  createCategoria: async (payload: CategoriaCreate): Promise<CategoriaResponse> => {
    const { data } = await api.post("/api/finanzas/categoria/", payload)
    return data
  },

  updateCategoria: async (idCategoria: number, payload: CategoriaPatch): Promise<CategoriaResponse> => {
    const { data } = await api.patch(`/api/finanzas/categoria/${idCategoria}`, payload)
    return data
  },

  deleteCategoria: async (idCategoria: number): Promise<void> => {
    await api.delete(`/api/finanzas/categoria/${idCategoria}`)
  },

  getCuentas: async (): Promise<CuentaResponse[]> => {
    const { data } = await api.get("/api/finanzas/cuentas/")
    return data
  },

  createCuenta: async (payload: CuentaCreate): Promise<CuentaResponse> => {
    const { data } = await api.post("/api/finanzas/cuentas/", payload)
    return data
  },

  updateCuenta: async (idCuenta: number, payload: CuentaPatch): Promise<CuentaResponse> => {
    const { data } = await api.patch(`/api/finanzas/cuentas/${idCuenta}`, payload)
    return data
  },

  deleteCuenta: async (idCuenta: number): Promise<void> => {
    await api.delete(`/api/finanzas/cuentas/${idCuenta}`)
  },

  getMovimientos: async (): Promise<MovimientoResponse[]> => {
    const { data } = await api.get("/api/finanzas/movimientos/")
    return data
  },

  createMovimiento: async (payload: MovimientoCreate): Promise<MovimientoResponse> => {
    const { data } = await api.post("/api/finanzas/movimientos/", payload)
    return data
  },

  updateMovimiento: async (
    idMovimiento: number,
    payload: MovimientoPatch
  ): Promise<MovimientoResponse> => {
    const { data } = await api.patch(`/api/finanzas/movimientos/${idMovimiento}`, payload)
    return data
  },
}
