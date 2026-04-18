"use client"

import { FormEvent, useState } from "react"
import { CalendarClock, ReceiptText, Wallet } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EditorialSelect, FieldGroup, FormNote, FormPanel } from "@/components/forms/editorial-form"
import { Input } from "@/components/ui/input"
import { useFinanzas } from "@/modules/finanzas/hooks/useFinanzas"
import {
  movimientoCreateSchema,
  TIPOS_GASTO,
  TIPOS_MOVIMIENTO,
} from "@/modules/finanzas/schemas/finanzas.schema"
import { TipoGasto, TipoMovimiento } from "@/modules/finanzas/types/finanzas"

const initialMovimientoForm = {
  id_categoria: "",
  id_cuenta: "",
  tipo_movimiento: "gasto" as TipoMovimiento,
  tipo_gasto: "variable" as TipoGasto,
  monto: "",
  descripcion: "",
  created_at: "",
}

export function MovimientoFormCard() {
  const {
    categorias,
    cuentas,
    loadingCatalogos,
    submittingMovimiento,
    crearMovimiento,
  } = useFinanzas()

  const [form, setForm] = useState(initialMovimientoForm)

  const handleCreateMovimiento = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = movimientoCreateSchema.safeParse({
      id_categoria: Number(form.id_categoria),
      id_cuenta: Number(form.id_cuenta),
      tipo_movimiento: form.tipo_movimiento,
      tipo_gasto: form.tipo_gasto,
      monto: Number(form.monto),
      descripcion: form.descripcion,
      created_at: form.created_at,
    })

    if (!parsed.success) {
      toast.error("Revisa el formulario", {
        description: parsed.error.issues[0]?.message ?? "Completa los datos del movimiento.",
      })
      return
    }

    const payload = {
      ...parsed.data,
      descripcion: parsed.data.descripcion || null,
      created_at: parsed.data.created_at ? ensureSeconds(parsed.data.created_at) : undefined,
    }

    const result = await crearMovimiento(payload)

    if (result.ok) {
      setForm(initialMovimientoForm)
      toast.success("Movimiento creado", {
        description: "El movimiento se registro correctamente.",
      })
      return
    }

    toast.error("No pudimos registrar el movimiento", {
      description: result.message,
    })
  }

  return (
    <FormPanel
      eyebrow="Finanzas"
      title="Registrar un movimiento"
      description="Anota cada ingreso o gasto como una entrada clara del diario financiero. Aqui importa tanto el contexto como el monto."
      aside={
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/12 text-primary">
              <Wallet className="size-4" />
            </span>
            <p className="text-sm leading-6 text-foreground/80">
              Elige bien la cuenta y la categoria para que despues el historial tenga sentido.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/12 text-primary">
              <ReceiptText className="size-4" />
            </span>
            <p className="text-sm leading-6 text-foreground/80">
              Una descripcion breve ayuda a recordar el contexto real del movimiento.
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleCreateMovimiento} className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <FieldGroup label="Categoria">
            <EditorialSelect
              value={form.id_categoria}
              onChange={(event) => setForm((prev) => ({ ...prev, id_categoria: event.target.value }))}
              required
            >
              <option value="">Selecciona una categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nombre}
                </option>
              ))}
            </EditorialSelect>
          </FieldGroup>

          <FieldGroup label="Cuenta bancaria">
            <EditorialSelect
              value={form.id_cuenta}
              onChange={(event) => setForm((prev) => ({ ...prev, id_cuenta: event.target.value }))}
              required
            >
              <option value="">Selecciona una cuenta</option>
              {cuentas.map((cuenta) => (
                <option key={cuenta.id_cuenta} value={cuenta.id_cuenta}>
                  {cuenta.nombre_cuenta}
                </option>
              ))}
            </EditorialSelect>
          </FieldGroup>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <FieldGroup label="Tipo de movimiento">
            <EditorialSelect
              value={form.tipo_movimiento}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, tipo_movimiento: event.target.value as TipoMovimiento }))
              }
            >
              {TIPOS_MOVIMIENTO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </EditorialSelect>
          </FieldGroup>

          <FieldGroup label="Tipo de gasto" hint="Solo clasifica el gasto">
            <EditorialSelect
              value={form.tipo_gasto}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, tipo_gasto: event.target.value as TipoGasto }))
              }
            >
              {TIPOS_GASTO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </EditorialSelect>
          </FieldGroup>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <FieldGroup label="Monto" hint="Mayor a 0">
            <Input
              type="number"
              min={1}
              placeholder="3500"
              value={form.monto}
              onChange={(event) => setForm((prev) => ({ ...prev, monto: event.target.value }))}
              className="h-13 rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 shadow-none focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0"
            />
          </FieldGroup>

          <FieldGroup label="Descripcion" hint="Opcional">
            <Input
              placeholder="Detalle del movimiento"
              value={form.descripcion}
              onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
              className="h-13 rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 shadow-none focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0"
            />
          </FieldGroup>
        </div>

        <FieldGroup label="Fecha" hint="Opcional">
          <div className="relative">
            <Input
              type="datetime-local"
              value={form.created_at}
              onChange={(event) => setForm((prev) => ({ ...prev, created_at: event.target.value }))}
              className="h-13 rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 pr-11 shadow-none focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0"
            />
            <CalendarClock className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </FieldGroup>

        <FormNote>
          Si no indicas fecha, el movimiento se registrara con el momento actual. Usa descripciones cortas y concretas para que el historial sea mas legible.
        </FormNote>

        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-xl sm:w-auto"
          disabled={submittingMovimiento || loadingCatalogos}
        >
          {submittingMovimiento ? "Guardando..." : "Registrar movimiento"}
        </Button>
      </form>
    </FormPanel>
  )
}

function ensureSeconds(value: string) {
  return value.length === 16 ? `${value}:00` : value
}
