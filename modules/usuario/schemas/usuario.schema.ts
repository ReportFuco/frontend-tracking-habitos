import { z } from "zod"

export const usuarioCreateSchema = z.object({
  nombre: z.string().min(2),
  telefono: z.string().min(8),
})

export type UsuarioCreate = z.infer<typeof usuarioCreateSchema>
