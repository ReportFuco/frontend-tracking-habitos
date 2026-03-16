// src/modules/usuarios/api/usuarios.api.ts
import { api } from "@/lib/api"
import { Usuario } from "@/modules/usuario/types/usuario"
import { UsuarioCreate } from "@/modules/usuario/schemas/usuario.schema"

export const UsuariosAPI = {
  getAll: async (): Promise<Usuario[]> => {
    const { data } = await api.get("/usuarios/usuario/")
    return data
  },

  create: async (payload: UsuarioCreate): Promise<Usuario> => {
    const { data } = await api.post("/usuarios/usuario/", payload)
    return data
  },
}
