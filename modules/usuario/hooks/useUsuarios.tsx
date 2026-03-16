// src/modules/usuarios/hooks/useUsuarios.ts
import { useEffect, useState } from "react"
import { UsuariosAPI } from "@/modules/usuario/api/usuario.api"
import { Usuario } from "@/modules/usuario/types/usuario"

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUsuarios = async () => {
    setLoading(true)
    setUsuarios(await UsuariosAPI.getAll())
    setLoading(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchUsuarios()
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  return { usuarios, loading, refetch: fetchUsuarios }
}
