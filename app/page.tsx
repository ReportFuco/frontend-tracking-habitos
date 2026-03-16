import Link from "next/link"

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-xl border bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Tracking Habitos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Frontend en construccion. Ya puedes comenzar con el modulo de finanzas.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/administrador"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Panel Admin
          </Link>

          <Link
            href="/usuarios"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input px-4 text-sm font-medium"
          >
            Usuarios
          </Link>
        </div>
      </div>
    </main>
  )
}
