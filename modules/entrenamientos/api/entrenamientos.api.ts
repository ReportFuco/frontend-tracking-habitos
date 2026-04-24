import { api } from "@/lib/api"
import {
  EjercicioCreate,
  EjercicioEdit,
  EjercicioResponse,
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

const toArray = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[]
  }

  if (
    payload &&
    typeof payload === "object" &&
    "results" in payload &&
    Array.isArray((payload as { results?: unknown[] }).results)
  ) {
    return (payload as { results: T[] }).results
  }

  return []
}

const normalizeEjercicio = (item: unknown): EjercicioResponse | null => {
  if (!item || typeof item !== "object") {
    return null
  }

  const record = item as Record<string, unknown>
  const id = Number(record.id_ejercicio ?? record.id ?? 0)
  const nombre = String(record.nombre ?? record.nombre_ejercicio ?? "").trim()
  const tipo = String(record.tipo ?? record.tipo_ejercicio ?? "").trim()

  if (!Number.isFinite(id) || id <= 0 || !nombre) {
    return null
  }

  return {
    id_ejercicio: id,
    nombre,
    tipo,
    url_video: typeof record.url_video === "string" ? record.url_video : null,
  }
}

const normalizeTipoMuscular = (item: unknown): string | null => {
  if (typeof item === "string") {
    const value = item.trim()
    return value || null
  }

  if (!item || typeof item !== "object") {
    return null
  }

  const record = item as Record<string, unknown>
  const value =
    record.tipo ?? record.nombre ?? record.label ?? record.value ?? record.descripcion ?? null

  if (typeof value !== "string") {
    return null
  }

  const normalized = value.trim()
  return normalized || null
}

const toEjercicioPayload = (payload: EjercicioCreate | EjercicioEdit) => {
  const body: Record<string, string | null> = {}

  if ("nombre" in payload && payload.nombre !== undefined) {
    body.nombre = payload.nombre ?? null
    body.nombre_ejercicio = payload.nombre ?? null
  }

  if ("tipo" in payload && payload.tipo !== undefined) {
    body.tipo = payload.tipo ?? null
    body.tipo_ejercicio = payload.tipo ?? null
  }

  if ("url_video" in payload && payload.url_video !== undefined) {
    body.url_video = payload.url_video
  }

  return body
}

export const EntrenamientosAPI = {
  getEjercicios: async (params?: { q?: string; tipo?: string }): Promise<EjercicioResponse[]> => {
    const { data } = await api.get("/api/entrenamientos/ejercicios/", {
      params: params?.q || params?.tipo ? params : undefined,
    })

    return toArray<unknown>(data).map(normalizeEjercicio).filter((item): item is EjercicioResponse => item !== null)
  },

  createEjercicio: async (payload: EjercicioCreate): Promise<EjercicioResponse> => {
    const { data } = await api.post("/api/entrenamientos/ejercicios/", toEjercicioPayload(payload))
    return normalizeEjercicio(data) ?? (data as EjercicioResponse)
  },

  updateEjercicio: async (idEjercicio: number, payload: EjercicioEdit): Promise<EjercicioResponse> => {
    const { data } = await api.patch(`/api/entrenamientos/ejercicios/${idEjercicio}`, toEjercicioPayload(payload))
    return normalizeEjercicio(data) ?? (data as EjercicioResponse)
  },

  deleteEjercicio: async (idEjercicio: number): Promise<void> => {
    await api.delete(`/api/entrenamientos/ejercicios/${idEjercicio}`)
  },

  getTiposMusculares: async (): Promise<string[]> => {
    const { data } = await api.get("/api/entrenamientos/ejercicios/musculos")

    return Array.from(
      new Set(toArray<unknown>(data).map(normalizeTipoMuscular).filter((item): item is string => item !== null))
    )
  },

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
