"use client"

import { FormEvent, useState } from "react"
import { Building2, Landmark } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { FormNote, FormPanel, FieldGroup, EditorialSelect } from "@/components/forms/editorial-form"
import { Input } from "@/components/ui/input"
import { useFinanzas } from "@/modules/finanzas/hooks/useFinanzas"
import { cuentaCreateSchema, TIPOS_CUENTA } from "@/modules/finanzas/schemas/finanzas.schema"
import { TipoCuenta } from "@/modules/finanzas/types/finanzas"

const initialCuentaForm = {
  id_banco: "",
  nombre_cuenta: "",
  tipo_cuenta: "Cuenta Corriente" as TipoCuenta,
}

export function CuentaFormCard() {
  const { bancos, loadingCatalogos, submittingCuenta, crearCuenta } = useFinanzas()
  const [form, setForm] = useState(initialCuentaForm)

  const handleCreateCuenta = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = cuentaCreateSchema.safeParse({
      id_banco: Number(form.id_banco),
      nombre_cuenta: form.nombre_cuenta,
      tipo_cuenta: form.tipo_cuenta,
    })

    if (!parsed.success) {
      toast.error("Revisa el formulario", {
        description: parsed.error.issues[0]?.message ?? "Completa los datos de la cuenta.",
      })
      return
    }

    const result = await crearCuenta(parsed.data)

    if (result.ok) {
      setForm(initialCuentaForm)
      toast.success("Cuenta creada", {
        description: "La cuenta bancaria fue creada correctamente.",
      })
      return
    }

    toast.error("No pudimos crear la cuenta", {
      description: result.message,
    })
  }

  return (
    <FormPanel
      eyebrow="Finanzas"
      title="Crear una cuenta bancaria"
      description="Esta cuenta sera la base para registrar tus movimientos. Dale un nombre claro y asociarla a su banco correcto."
      aside={
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/12 text-primary">
              <Landmark className="size-4" />
            </span>
            <p className="text-sm leading-6 text-foreground/80">
              Piensa esta vista como el punto de partida del modulo financiero.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/12 text-primary">
              <Building2 className="size-4" />
            </span>
            <p className="text-sm leading-6 text-foreground/80">
              Mientras mas claro sea el nombre, mas facil sera registrar y leer movimientos despues.
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleCreateCuenta} className="space-y-5">
        <FieldGroup label="Banco">
          <EditorialSelect
            value={form.id_banco}
            onChange={(event) => setForm((prev) => ({ ...prev, id_banco: event.target.value }))}
            required
          >
            <option value="">Selecciona un banco</option>
            {bancos.map((banco) => (
              <option key={banco.id_banco} value={banco.id_banco}>
                {banco.nombre_banco}
              </option>
            ))}
          </EditorialSelect>
        </FieldGroup>

        <FieldGroup label="Nombre de la cuenta" hint="Visible en tus movimientos">
          <Input
            placeholder="Ej: Cuenta principal"
            value={form.nombre_cuenta}
            onChange={(event) => setForm((prev) => ({ ...prev, nombre_cuenta: event.target.value }))}
            className="h-13 rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 shadow-none focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0"
          />
        </FieldGroup>

        <FieldGroup label="Tipo de cuenta">
          <EditorialSelect
            value={form.tipo_cuenta}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, tipo_cuenta: event.target.value as TipoCuenta }))
            }
          >
            {TIPOS_CUENTA.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </EditorialSelect>
        </FieldGroup>

        <FormNote>
          Esta cuenta quedara disponible para usarla luego en el registro de ingresos y gastos.
        </FormNote>

        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-xl sm:w-auto"
          disabled={submittingCuenta || loadingCatalogos}
        >
          {submittingCuenta ? "Guardando..." : "Crear cuenta bancaria"}
        </Button>
      </form>
    </FormPanel>
  )
}
