import { api } from "@/lib/api"
import {
  EntrenoFuerzaCreate,
  EntrenoFuerzaResponse,
  EntrenoFuerzaSerieResponse,
  GimnasioCreate,
  GimnasioEdit,
  GimnasioResponse,
  SerieFuerzaCreate,
  SerieFuerzaPatch,
  SerieFuerzaResponse,
} from "@/modules/entrenamientos/types/entrenamientos"

export const EntrenamientosAPI = {
  getGimnasios: async (q?: string): Promise<GimnasioResponse[]> => {
    const { data } = await api.get("/api/entrenamientos/gimnasio/", {
      params: q ? { q } : undefined,
    })
    return data
  },

  getGimnasioById: async (idGimnasio: number): Promise<GimnasioResponse> => {
    const { data } = await api.get(`/api/entrenamientos/gimnasio/${idGimnasio}`)
    return data
  },

  createGimnasio: async (payload: GimnasioCreate): Promise<GimnasioResponse> => {
    const { data } = await api.post("/api/entrenamientos/gimnasio/", payload)
    return data
  },

  updateGimnasio: async (idGimnasio: number, payload: GimnasioEdit): Promise<GimnasioResponse> => {
    const { data } = await api.patch(`/api/entrenamientos/gimnasio/${idGimnasio}`, payload)
    return data
  },

  deleteGimnasio: async (idGimnasio: number): Promise<void> => {
    await api.delete(`/api/entrenamientos/gimnasio/${idGimnasio}`)
  },

  getEntrenosFuerza: async (): Promise<EntrenoFuerzaResponse[]> => {
    const { data } = await api.get("/api/entrenamientos/fuerza/")
    return data
  },

  createEntrenoFuerza: async (payload: EntrenoFuerzaCreate): Promise<EntrenoFuerzaResponse> => {
    const { data } = await api.post("/api/entrenamientos/fuerza/", payload)
    return data
  },

  getEntrenoFuerzaActivo: async (): Promise<EntrenoFuerzaSerieResponse> => {
    const { data } = await api.get("/api/entrenamientos/fuerza/activo")
    return data
  },

  getEntrenoFuerzaDetalle: async (
    idEntrenamientoFuerza: number
  ): Promise<EntrenoFuerzaSerieResponse> => {
    const { data } = await api.get(`/api/entrenamientos/fuerza/${idEntrenamientoFuerza}`)
    return data
  },

  closeEntrenoFuerzaActivo: async (): Promise<EntrenoFuerzaResponse> => {
    const { data } = await api.patch("/api/entrenamientos/fuerza/activo/cerrar")
    return data
  },

  createSerieFuerza: async (payload: SerieFuerzaCreate): Promise<SerieFuerzaResponse> => {
    const { data } = await api.post("/api/entrenamientos/series/", payload)
    return data
  },

  updateSerieFuerza: async (
    idFuerzaDetalle: number,
    payload: SerieFuerzaPatch
  ): Promise<SerieFuerzaResponse> => {
    const { data } = await api.patch(`/api/entrenamientos/series/${idFuerzaDetalle}`, payload)
    return data
  },

  deleteSerieFuerza: async (idFuerzaDetalle: number): Promise<void> => {
    await api.delete(`/api/entrenamientos/series/${idFuerzaDetalle}`)
  },
}
