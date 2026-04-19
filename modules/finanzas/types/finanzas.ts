export type TipoMovimiento = "gasto" | "ingreso"

export type TipoGasto = "variable" | "fijo"

export interface BancoCreate {
  nombre_banco: string
}

export interface BancoResponse {
  id_banco: number
  nombre_banco: string
  created_at: string
}

export interface ProductoFinancieroCreate {
  id_banco: number
  nombre_producto: string
  descripcion?: string | null
}

export interface ProductoFinancieroPatch {
  nombre_producto?: string | null
  descripcion?: string | null
  activo?: boolean | null
}

export interface ProductoFinancieroResponse {
  id_producto_financiero: number
  id_banco: number
  nombre_producto: string
  descripcion?: string | null
  nombre_banco?: string | null
  activo?: boolean
  created_at: string
}

export interface CategoriaCreate {
  nombre: string
}

export interface CategoriaPatch {
  nombre: string | null
}

export interface CategoriaResponse {
  id_categoria: number
  nombre: string
  created_at: string
}

export interface CuentaCreate {
  id_producto_financiero: number
  nombre_cuenta: string
}

export interface CuentaPatch {
  nombre_cuenta?: string | null
}

export interface CuentaResponse {
  id_cuenta: number
  nombre_cuenta: string
  nombre_banco?: string | null
  nombre_producto?: string | null
  id_producto_financiero?: number | null
  created_at: string
}

export interface MovimientoCreate {
  id_categoria: number
  id_cuenta: number
  tipo_movimiento: TipoMovimiento
  tipo_gasto: TipoGasto
  monto: number
  descripcion?: string | null
  created_at?: string
}

export interface MovimientoPatch {
  id_categoria?: number | null
  id_cuenta?: number | null
  tipo_movimiento?: TipoMovimiento | null
  tipo_gasto?: TipoGasto | null
  monto?: number | null
}

export interface MovimientoResponse {
  id_transaccion: number
  tipo_movimiento: TipoMovimiento
  tipo_gasto: TipoGasto
  categoria?: string | null
  nombre_cuenta?: string | null
  monto: number
  descripcion: string
  created_at: string
}
