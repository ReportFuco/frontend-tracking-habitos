"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import { authLoginSchema, authRegisterSchema } from "@/modules/auth/schemas/auth.schema"

const initialLogin = {
  username: "",
  password: "",
}

const initialRegister = {
  email: "",
  password: "",
  username: "",
  nombre: "",
  apellido: "",
  telefono: "",
}

export default function UsuariosPage() {
  const router = useRouter()
  const { profile, token, loadingProfile, submitting, error, isAuthenticated, login, register, logout } =
    useAuth()

  const [loginForm, setLoginForm] = useState(initialLogin)
  const [registerForm, setRegisterForm] = useState(initialRegister)
  const [uiMessage, setUiMessage] = useState<string | null>(null)

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUiMessage(null)

    const parsed = authLoginSchema.safeParse(loginForm)

    if (!parsed.success) {
      setUiMessage(parsed.error.issues[0]?.message ?? "Formulario invalido")
      return
    }

    const result = await login(parsed.data)

    if (result.ok) {
      setLoginForm(initialLogin)
      setUiMessage("Sesion iniciada correctamente")
      const nextPath =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next")
          : null
      router.push(nextPath || "/administrador")
      return
    }

    setUiMessage(result.message)
  }

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUiMessage(null)

    const parsed = authRegisterSchema.safeParse(registerForm)

    if (!parsed.success) {
      setUiMessage(parsed.error.issues[0]?.message ?? "Formulario invalido")
      return
    }

    const result = await register(parsed.data)

    if (result.ok) {
      setRegisterForm(initialRegister)
      setUiMessage("Usuario registrado. Ahora puedes iniciar sesion.")
      return
    }

    setUiMessage(result.message)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Usuarios y Autenticacion</h1>
        <p className="text-sm text-muted-foreground">
          Inicia sesion para obtener JWT y consumir endpoints protegidos como /finanzas.
        </p>
      </header>

      {(uiMessage || error) && (
        <div className="rounded-md border border-amber-500/40 bg-amber-50 p-3 text-sm text-amber-900">
          {uiMessage ?? error}
        </div>
      )}

      {isAuthenticated ? (
        <Card>
          <CardHeader>
            <CardTitle>Sesion Activa</CardTitle>
            <CardDescription>
              Tu token JWT ya esta guardado en localStorage y axios lo envia automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4 text-sm">
              <p>
                <span className="font-medium">Token:</span> {token?.slice(0, 35)}...
              </p>
              {loadingProfile ? (
                <p className="mt-2">Cargando perfil...</p>
              ) : profile ? (
                <div className="mt-3 space-y-1">
                  <p>
                    <span className="font-medium">Usuario:</span> {profile.username}
                  </p>
                  <p>
                    <span className="font-medium">Nombre:</span> {profile.nombre} {profile.apellido}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {profile.email}
                  </p>
                  <p>
                    <span className="font-medium">Telefono:</span> {profile.telefono}
                  </p>
                </div>
              ) : (
                <p className="mt-2">No se pudo cargar el perfil.</p>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                href="/administrador"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
              >
                Ir a Panel Admin
              </Link>
              <Button variant="outline" onClick={logout} disabled={submitting}>
                Cerrar sesion
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Iniciar Sesion</CardTitle>
              <CardDescription>Usa tu usuario/email y password para obtener el JWT.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Usuario o Email</label>
                  <Input
                    value={loginForm.username}
                    onChange={(event) =>
                      setLoginForm((prev) => ({ ...prev, username: event.target.value }))
                    }
                    placeholder="usuario o correo"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                    }
                    placeholder="******"
                  />
                </div>

                <Button type="submit" disabled={submitting}>
                  {submitting ? "Ingresando..." : "Ingresar"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registro</CardTitle>
              <CardDescription>Crea tu usuario para luego iniciar sesion.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    placeholder="Nombre"
                    value={registerForm.nombre}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({ ...prev, nombre: event.target.value }))
                    }
                  />
                  <Input
                    placeholder="Apellido"
                    value={registerForm.apellido}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({ ...prev, apellido: event.target.value }))
                    }
                  />
                </div>

                <Input
                  placeholder="Username"
                  value={registerForm.username}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, username: event.target.value }))
                  }
                />

                <Input
                  type="email"
                  placeholder="correo@dominio.com"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                />

                <Input
                  placeholder="Telefono"
                  value={registerForm.telefono}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, telefono: event.target.value }))
                  }
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={registerForm.password}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                />

                <Button type="submit" disabled={submitting}>
                  {submitting ? "Registrando..." : "Crear usuario"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      )}
    </main>
  )
}
