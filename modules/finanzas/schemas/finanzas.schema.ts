import { z } from "zod"

export const TIPOS_CUENTA = ["Cuenta Corriente", "Cuenta vista", "Cuenta ahorro"] as const
export const TIPOS_MOVIMIENTO = ["gasto", "ingreso"] as const
export const TIPOS_GASTO = ["variable", "fijo"] as const

export const cuentaCreateSchema = z.object({
  id_banco: z.number().int().positive(),
  nombre_cuenta: z.string().min(2, "El nombre de la cuenta debe tener al menos 2 caracteres"),
  tipo_cuenta: z.enum(TIPOS_CUENTA),
})

export const movimientoCreateSchema = z.object({
  id_categoria: z.number().int().positive(),
  id_cuenta: z.number().int().positive(),
  tipo_movimiento: z.enum(TIPOS_MOVIMIENTO),
  tipo_gasto: z.enum(TIPOS_GASTO),
  monto: z.number().int().positive("El monto debe ser mayor a 0"),
  descripcion: z.string().trim().max(250).optional().or(z.literal("")),
})

export type CuentaCreateForm = z.infer<typeof cuentaCreateSchema>
export type MovimientoCreateForm = z.infer<typeof movimientoCreateSchema>
