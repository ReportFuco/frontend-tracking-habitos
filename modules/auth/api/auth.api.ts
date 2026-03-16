import { api } from "@/lib/api"
import {
  AuthLoginPayload,
  AuthRegisterPayload,
  AuthRegisterResponse,
  AuthTokenResponse,
  UsuarioProfile,
} from "@/modules/auth/types/auth"

export const AuthAPI = {
  login: async (payload: AuthLoginPayload): Promise<AuthTokenResponse> => {
    const body = new URLSearchParams()
    body.append("username", payload.username)
    body.append("password", payload.password)

    const { data } = await api.post("/auth/jwt/login", body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    return data
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/jwt/logout")
  },

  register: async (payload: AuthRegisterPayload): Promise<AuthRegisterResponse> => {
    const { data } = await api.post("/auth/register", payload)
    return data
  },

  getProfile: async (): Promise<UsuarioProfile> => {
    const { data } = await api.get("/api/usuarios/perfil")
    return data
  },
}
