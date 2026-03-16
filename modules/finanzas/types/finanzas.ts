export type TipoCuenta = "Cuenta Corriente" | "Cuenta vista" | "Cuenta ahorro"

export type TipoMovimiento = "gasto" | "ingreso"

export type TipoGasto = "variable" | "fijo"

export interface BancoResponse {
  id_banco: number
  nombre_banco: string
  created_at: string
}

export interface CategoriaResponse {
  id_categoria: number
  nombre: string
  created_at: string
}

export interface CuentaCreate {
  id_banco: number
  nombre_cuenta: string
  tipo_cuenta: TipoCuenta
}

export interface CuentaResponse {
  id_cuenta: number
  nombre_cuenta: string
  tipo_cuenta: TipoCuenta
  nombre_banco?: string | null
  created_at: string
}

export interface MovimientoCreate {
  id_categoria: number
  id_cuenta: number
  tipo_movimiento: TipoMovimiento
  tipo_gasto: TipoGasto
  monto: number
  descripcion?: string | null
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
