import { api } from "@/lib/api"
import {
  CadenaResponse,
  CompraCreate,
  CompraDetalleCreate,
  CompraDetallePatch,
  CompraDetalleResponse,
  CompraPatch,
  CompraResponse,
  LocalResponse,
} from "@/modules/compras/types/compras"

export const ComprasAPI = {
  getCadenas: async (): Promise<CadenaResponse[]> => {
    const { data } = await api.get("/api/compras/cadena/")
    return data
  },

  getLocales: async (): Promise<LocalResponse[]> => {
    const { data } = await api.get("/api/compras/local/")
    return data
  },

  getCompras: async (): Promise<CompraResponse[]> => {
    const { data } = await api.get("/api/compras/compra/")
    return data
  },

  getCompra: async (idCompra: number): Promise<CompraResponse> => {
    const { data } = await api.get(`/api/compras/compra/${idCompra}`)
    return data
  },

  createCompra: async (payload: CompraCreate): Promise<CompraResponse> => {
    const { data } = await api.post("/api/compras/compra/", payload)
    return data
  },

  updateCompra: async (idCompra: number, payload: CompraPatch): Promise<CompraResponse> => {
    const { data } = await api.patch(`/api/compras/compra/${idCompra}`, payload)
    return data
  },

  deleteCompra: async (idCompra: number): Promise<void> => {
    await api.delete(`/api/compras/compra/${idCompra}`)
  },

  getCompraDetalles: async (idCompra: number): Promise<CompraDetalleResponse[]> => {
    const { data } = await api.get("/api/compras/compra-detalle/", {
      params: { id_compra: idCompra },
    })
    return data
  },

  createCompraDetalle: async (
    payload: CompraDetalleCreate
  ): Promise<CompraDetalleResponse> => {
    const { data } = await api.post("/api/compras/compra-detalle/", payload)
    return data
  },

  updateCompraDetalle: async (
    idDetalle: number,
    payload: CompraDetallePatch
  ): Promise<CompraDetalleResponse> => {
    const { data } = await api.patch(`/api/compras/compra-detalle/${idDetalle}`, payload)
    return data
  },

  deleteCompraDetalle: async (idDetalle: number): Promise<void> => {
    await api.delete(`/api/compras/compra-detalle/${idDetalle}`)
  },
}
