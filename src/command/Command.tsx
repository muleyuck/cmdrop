import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CommandContext, type CommandContextValue } from "./context"

interface CommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

interface RegisteredItem {
  value: string
  onSelect: () => void
}

export function Command({ open: controlledOpen, onOpenChange, children }: CommandProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const [highlightedValue, setHighlightedValue] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [itemCount, setItemCount] = useState(0)

  const setOpen = useCallback(
    (next: boolean) => {
      if (!next) setHighlightedValue(null)
      if (controlledOpen === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [controlledOpen, onOpenChange],
  )

  const openRef = useRef(open)
  openRef.current = open
  const setOpenRef = useRef(setOpen)
  setOpenRef.current = setOpen

  const highlightedRef = useRef(highlightedValue)
  highlightedRef.current = highlightedValue

  const itemsRef = useRef<RegisteredItem[]>([])

  const registerItem = useCallback((value: string, onSelect: () => void) => {
    const existing = itemsRef.current.find((i) => i.value === value)
    if (existing) {
      existing.onSelect = onSelect
    } else {
      itemsRef.current.push({ value, onSelect })
      setItemCount((c) => c + 1)
    }
  }, [])

  const unregisterItem = useCallback((value: string) => {
    const existed = itemsRef.current.some((i) => i.value === value)
    itemsRef.current = itemsRef.current.filter((i) => i.value !== value)
    if (existed) setItemCount((c) => c - 1)
    if (highlightedRef.current === value) setHighlightedValue(null)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.isComposing) return
      const list = itemsRef.current
      const current = highlightedRef.current
      const idx = list.findIndex((i) => i.value === (current ?? ""))

      if (e.key === "Escape" && openRef.current) {
        e.preventDefault()
        setOpenRef.current(false)
      } else if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenRef.current(!openRef.current)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        const next = idx < list.length - 1 ? list[idx + 1] : list[0]
        if (next !== undefined) setHighlightedValue(next.value)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prev = idx > 0 ? list[idx - 1] : list[list.length - 1]
        if (prev !== undefined) setHighlightedValue(prev.value)
      } else if (e.key === "Enter") {
        const item = list.find((i) => i.value === (current ?? ""))
        if (item) {
          e.preventDefault()
          item.onSelect()
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const ctx: CommandContextValue = useMemo(
    () => ({
      open,
      setOpen,
      query,
      setQuery,
      highlightedValue,
      setHighlightedValue,
      registerItem,
      unregisterItem,
      itemCount,
    }),
    [open, setOpen, query, highlightedValue, registerItem, unregisterItem, itemCount],
  )

  return <CommandContext.Provider value={ctx}>{children}</CommandContext.Provider>
}
