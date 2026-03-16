import { api } from "@/lib/api"
import {
  BancoResponse,
  CategoriaResponse,
  CuentaCreate,
  CuentaResponse,
  MovimientoCreate,
  MovimientoResponse,
} from "@/modules/finanzas/types/finanzas"

export const FinanzasAPI = {
  getBancos: async (): Promise<BancoResponse[]> => {
    const { data } = await api.get("/api/finanzas/banco/")
    return data
  },

  getCategorias: async (): Promise<CategoriaResponse[]> => {
    const { data } = await api.get("/api/finanzas/categoria/")
    return data
  },

  getCuentas: async (): Promise<CuentaResponse[]> => {
    const { data } = await api.get("/api/finanzas/cuentas/")
    return data
  },

  getMovimientos: async (): Promise<MovimientoResponse[]> => {
    const { data } = await api.get("/api/finanzas/movimientos/")
    return data
  },

  createCuenta: async (payload: CuentaCreate): Promise<CuentaResponse> => {
    const { data } = await api.post("/api/finanzas/cuentas/", payload)
    return data
  },

  createMovimiento: async (payload: MovimientoCreate): Promise<MovimientoResponse> => {
    const { data } = await api.post("/api/finanzas/movimientos/", payload)
    return data
  },
}
