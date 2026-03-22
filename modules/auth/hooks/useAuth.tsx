"use client"

import { useCallback, useEffect, useState } from "react"
import { clearStoredSession, getValidStoredToken } from "@/lib/auth-session"
import { getFriendlyErrorMessage } from "@/lib/error-messages"
import { AuthAPI } from "@/modules/auth/api/auth.api"
import { AuthLoginPayload, AuthRegisterPayload, UsuarioProfile } from "@/modules/auth/types/auth"

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
      const message = getFriendlyErrorMessage(err)
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
      localStorage.setItem("auth_token", data.access_token)
      setToken(data.access_token)
      await fetchProfile()
      return { ok: true as const }
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
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
      const message = getFriendlyErrorMessage(err)
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
      clearStoredSession()
      setToken(null)
      setProfile(null)
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const savedToken = getValidStoredToken()

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
