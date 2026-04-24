"use client";

import {
  KeyboardEvent,
  CSSProperties,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string | null;
}

interface SearchableComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  disabledMessage?: string;
  loading?: boolean;
  loadingMessage?: string;
  allowClear?: boolean;
  leadingIcon?: ReactNode;
  className?: string;
  required?: boolean;
  id?: string;
  searchPlaceholder?: string;
  compactOnMobile?: boolean;
}

interface DropdownPosition {
  listMaxHeight: number;
  style: CSSProperties;
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
  compactOnMobile = false,
}: SearchableComboboxProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    listMaxHeight: compactOnMobile ? 208 : 256,
    style: {},
  });

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");

    if (!normalized) return options;

    return options.filter((option) => {
      const haystack =
        `${option.label} ${option.description ?? ""}`.toLocaleLowerCase("es");
      return haystack.includes(normalized);
    });
  }, [options, query]);
  const highlightedIndex = Math.min(
    highlighted,
    Math.max(filtered.length - 1, 0),
  );

  const closeCombobox = () => {
    setOpen(false);
    setQuery("");
    setHighlighted(0);
  };

  useEffect(() => {
    if (!open) return;

    const updateDropdownPosition = () => {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const horizontalMargin = 12;
      const verticalMargin = 12;
      const gap = 8;
      const minListHeight = 96;

      const width = Math.min(rect.width, viewportWidth - horizontalMargin * 2);
      const maxLeft = viewportWidth - horizontalMargin - width;
      const left = Math.min(Math.max(rect.left, horizontalMargin), maxLeft);

      const spaceBelow = viewportHeight - rect.bottom - gap - verticalMargin;
      const spaceAbove = rect.top - gap - verticalMargin;
      const openAbove = spaceBelow < 220 && spaceAbove > spaceBelow;
      const availableSpace = Math.max(
        openAbove ? spaceAbove : spaceBelow,
        minListHeight,
      );

      setDropdownPosition({
        listMaxHeight: availableSpace,
        style: openAbove
          ? {
              bottom: Math.max(viewportHeight - rect.top + gap, verticalMargin),
              left,
              position: "fixed",
              width,
              zIndex: 50,
            }
          : {
              left,
              position: "fixed",
              top: Math.max(rect.bottom + gap, verticalMargin),
              width,
              zIndex: 50,
            },
      });
    };

    updateDropdownPosition();

    const handleViewportChange = () => {
      window.requestAnimationFrame(updateDropdownPosition);
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    window.visualViewport?.addEventListener("resize", handleViewportChange);
    window.visualViewport?.addEventListener("scroll", handleViewportChange);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
      window.visualViewport?.removeEventListener("resize", handleViewportChange);
      window.visualViewport?.removeEventListener("scroll", handleViewportChange);
    };
  }, [compactOnMobile, open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as Node;

      if (containerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;

        closeCombobox();
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const disabledState = disabled || loading;

  const handleSelect = (option: ComboboxOption) => {
    onChange(option.value);
    closeCombobox();
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((prev) =>
        Math.min(prev + 1, Math.max(filtered.length - 1, 0)),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const option = filtered[highlightedIndex];
      if (option) handleSelect(option);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeCombobox();
    }
  };

  const dropdownPanel = open ? (
    <div
      ref={dropdownRef}
      className={cn(
        "overflow-hidden rounded-4xl bg-surface-lowest shadow-(--shadow-airy-lg)",
        "ring-1 ring-black/5",
      )}
      style={dropdownPosition.style}
      role="dialog"
    >
      <div className="flex items-center gap-2 border-b border-(--border)/40 bg-surface-low px-3 py-2.5">
        <Search className="size-4 text-muted-foreground" />
        <input
          ref={searchInputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setHighlighted(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={searchPlaceholder}
          className={cn(
            "flex-1 border-0 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-sm",
            compactOnMobile ? "h-8 sm:h-9" : "h-9",
          )}
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
          className="overflow-y-auto py-1.5"
          style={{ maxHeight: dropdownPosition.listMaxHeight }}
        >
          {filtered.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
              >
                <button
                  type="button"
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex w-full items-start gap-3 text-left transition",
                    compactOnMobile
                      ? "px-3 py-2 sm:px-4 sm:py-2.5"
                      : "px-4 py-2.5",
                    isHighlighted && "bg-primary/8",
                    isSelected && "bg-primary/12",
                  )}
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">
                      {option.label}
                    </span>
                    {option.description ? (
                      <span
                        className={cn(
                          "truncate text-xs text-muted-foreground",
                          compactOnMobile && "hidden sm:block",
                        )}
                      >
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                  {isSelected ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  ) : null;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabledState}
        onClick={() => {
          if (disabledState) return;
          if (open) {
            closeCombobox();
            return;
          }
          setOpen(true);
          setHighlighted(0);
        }}
        className={cn(
          "flex w-full items-center gap-3 rounded-3xl border-0 bg-surface-variant text-left text-sm text-foreground shadow-none outline-none transition",
          compactOnMobile ? "h-12 px-3 sm:h-13 sm:px-4" : "h-13 px-4",
          "focus-visible:border-b-2 focus-visible:border-primary",
          disabledState && "cursor-not-allowed opacity-70",
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
                <span
                  className={cn(
                    "truncate text-xs text-muted-foreground",
                    compactOnMobile && "hidden sm:block",
                  )}
                >
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
                event.preventDefault();
                onChange("");
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
            open && "rotate-180",
          )}
        />
      </button>

      {dropdownPanel && typeof document !== "undefined"
        ? createPortal(dropdownPanel, document.body)
        : null}
    </div>
  );
}
