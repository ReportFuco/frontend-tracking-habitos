export interface GimnasioCreate {
  nombre_gimnasio: string
  nombre_cadena: string | null
  direccion: string
  comuna: string | null
  latitud: number
  longitud: number
}

export interface GimnasioEdit {
  nombre_gimnasio?: string | null
  nombre_cadena?: string | null
  direccion?: string | null
  comuna?: string | null
  latitud?: number | null
  longitud?: number | null
}

export interface GimnasioResponse {
  id_gimnasio: number
  nombre_gimnasio: string
  nombre_cadena: string | null
  direccion: string
  comuna: string | null
  latitud: number
  longitud: number
  activo: boolean
  created_at: string
}

export interface EntrenoFuerzaCreate {
  observacion?: string | null
  id_gimnasio: number
}

export interface EntrenoFuerzaResponse {
  id_entrenamiento: number
  id_entrenamiento_fuerza: number
  estado: string
  inicio_at: string
  fin_at: string | null
  nombre_gimnasio?: string | null
  nombre_cadena?: string | null
  comuna?: string | null
  direccion?: string | null
  latitud?: number | null
  longitud?: number | null
}

export interface SerieFuerzaCreate {
  id_ejercicio: number
  es_calentamiento: boolean
  cantidad_peso: number
  repeticiones: number
}

export interface SerieFuerzaPatch {
  id_ejercicio?: number | null
  es_calentamiento?: boolean | null
  cantidad_peso?: number | null
  repeticiones?: number | null
}

export interface SerieFuerzaResponse {
  id_fuerza_detalle: number
  es_calentamiento: boolean
  cantidad_peso: number
  repeticiones: number
  nombre_ejercicio?: string | null
  tipo_ejercicio?: string | null
  url_video?: string | null
}

export interface EntrenoFuerzaSerieResponse {
  id_entrenamiento_fuerza: number
  estado: string
  inicio_at: string
  fin_at: string | null
  nombre_gimnasio?: string | null
  nombre_cadena?: string | null
  comuna?: string | null
  direccion?: string | null
  latitud?: number | null
  longitud?: number | null
  series?: SerieFuerzaResponse[]
}
