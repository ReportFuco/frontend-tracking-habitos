"use client"

import {
  KeyboardEvent,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { Check, ChevronDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ComboboxOption {
  value: string
  label: string
  description?: string | null
}

interface SearchableComboboxProps {
  value: string
  onChange: (value: string) => void
  options: ComboboxOption[]
  placeholder?: string
  emptyMessage?: string
  disabled?: boolean
  disabledMessage?: string
  loading?: boolean
  loadingMessage?: string
  allowClear?: boolean
  leadingIcon?: ReactNode
  className?: string
  required?: boolean
  id?: string
  searchPlaceholder?: string
}

export function SearchableCombobox({
  value,
  onChange,
  options,
  placeholder = "Selecciona una opcion",
  emptyMessage = "Sin resultados",
  disabled = false,
  disabledMessage,
  loading = false,
  loadingMessage = "Cargando...",
  allowClear = true,
  leadingIcon,
  className,
  id,
  searchPlaceholder = "Buscar...",
}: SearchableComboboxProps) {
  const generatedId = useId()
  const triggerId = id ?? generatedId
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  )

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es")

    if (!normalized) return options

    return options.filter((option) => {
      const haystack = `${option.label} ${option.description ?? ""}`.toLocaleLowerCase("es")
      return haystack.includes(normalized)
    })
  }, [options, query])
  const highlightedIndex = Math.min(highlighted, Math.max(filtered.length - 1, 0))

  const closeCombobox = () => {
    setOpen(false)
    setQuery("")
    setHighlighted(0)
  }

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        closeCombobox()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  useEffect(() => {
    if (!open) return

    const frame = requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [open])

  const disabledState = disabled || loading

  const handleSelect = (option: ComboboxOption) => {
    onChange(option.value)
    closeCombobox()
  }

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation()
    onChange("")
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setHighlighted((prev) => Math.min(prev + 1, Math.max(filtered.length - 1, 0)))
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setHighlighted((prev) => Math.max(prev - 1, 0))
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      const option = filtered[highlightedIndex]
      if (option) handleSelect(option)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      closeCombobox()
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        id={triggerId}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabledState}
        onClick={() => {
          if (disabledState) return
          if (open) {
            closeCombobox()
            return
          }
          setOpen(true)
          setHighlighted(0)
        }}
        className={cn(
          "flex h-13 w-full items-center gap-3 rounded-[1rem] border-0 bg-[color:var(--surface-variant)] px-4 text-left text-sm text-foreground shadow-none outline-none transition",
          "focus-visible:border-b-2 focus-visible:border-primary",
          disabledState && "cursor-not-allowed opacity-70"
        )}
      >
        {leadingIcon ? (
          <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
            {leadingIcon}
          </span>
        ) : null}

        <span className="flex min-w-0 flex-1 flex-col">
          {selected ? (
            <>
              <span className="truncate text-sm font-medium text-foreground">
                {selected.label}
              </span>
              {selected.description ? (
                <span className="truncate text-xs text-muted-foreground">
                  {selected.description}
                </span>
              ) : null}
            </>
          ) : (
            <span className="truncate text-sm text-muted-foreground">
              {disabled && disabledMessage
                ? disabledMessage
                : loading
                  ? loadingMessage
                  : placeholder}
            </span>
          )}
        </span>

        {selected && allowClear && !disabledState ? (
          <span
            role="button"
            aria-label="Limpiar seleccion"
            tabIndex={0}
            onClick={handleClear}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onChange("")
              }
            }}
            className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-background/80 hover:text-foreground"
          >
            <X className="size-3.5" />
          </span>
        ) : null}

        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <div
          className={cn(
            "absolute z-50 mt-2 w-full overflow-hidden rounded-[1.25rem] bg-[color:var(--surface-lowest)] shadow-[var(--shadow-airy-lg)]",
            "ring-1 ring-black/5"
          )}
          role="dialog"
        >
          <div className="flex items-center gap-2 border-b border-[color:var(--border)]/40 bg-[color:var(--surface-low)] px-3 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setHighlighted(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              className="h-9 flex-1 border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition hover:bg-background/80 hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {loading ? loadingMessage : emptyMessage}
            </div>
          ) : (
            <ul
              ref={listRef}
              role="listbox"
              className="max-h-64 overflow-y-auto py-1.5"
            >
              {filtered.map((option, index) => {
                const isSelected = option.value === value
                const isHighlighted = index === highlightedIndex

                return (
                  <li key={option.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlighted(index)}
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-2.5 text-left transition",
                        isHighlighted && "bg-primary/8",
                        isSelected && "bg-primary/12"
                      )}
                    >
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium text-foreground">
                          {option.label}
                        </span>
                        {option.description ? (
                          <span className="truncate text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        ) : null}
                      </span>
                      {isSelected ? (
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}
