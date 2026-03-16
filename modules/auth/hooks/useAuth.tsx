"use client"

import { AxiosError } from "axios"
import { useCallback, useEffect, useState } from "react"
import { AuthAPI } from "@/modules/auth/api/auth.api"
import { AuthLoginPayload, AuthRegisterPayload, UsuarioProfile } from "@/modules/auth/types/auth"

const TOKEN_KEY = "auth_token"

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail

    if (typeof detail === "string") {
      return detail
    }

    return error.message
  }

  return "Ocurrio un error inesperado"
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null)
  const [profile, setProfile] = useState<UsuarioProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    setLoadingProfile(true)
    setError(null)

    try {
      const data = await AuthAPI.getProfile()
      setProfile(data)
      return { ok: true as const, data }
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      setProfile(null)
      return { ok: false as const, message }
    } finally {
      setLoadingProfile(false)
    }
  }, [])

  const login = async (payload: AuthLoginPayload) => {
    setSubmitting(true)
    setError(null)

    try {
      const data = await AuthAPI.login(payload)
      localStorage.setItem(TOKEN_KEY, data.access_token)
      setToken(data.access_token)
      await fetchProfile()
      return { ok: true as const }
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      return { ok: false as const, message }
    } finally {
      setSubmitting(false)
    }
  }

  const register = async (payload: AuthRegisterPayload) => {
    setSubmitting(true)
    setError(null)

    try {
      await AuthAPI.register(payload)
      return { ok: true as const }
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      return { ok: false as const, message }
    } finally {
      setSubmitting(false)
    }
  }

  const logout = async () => {
    setSubmitting(true)

    try {
      await AuthAPI.logout()
    } catch {
      // Si falla el logout backend igualmente limpiamos sesion local
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setProfile(null)
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY) ?? localStorage.getItem("token")

    if (!savedToken) {
      return
    }

    setToken(savedToken)

    const timer = setTimeout(() => {
      void fetchProfile()
    }, 0)

    return () => clearTimeout(timer)
  }, [fetchProfile])

  return {
    token,
    profile,
    loadingProfile,
    submitting,
    error,
    isAuthenticated: Boolean(token),
    fetchProfile,
    login,
    register,
    logout,
  }
}
