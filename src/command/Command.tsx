import { type ReactNode, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react"
import { CommandContext, type CommandContextValue } from "./context"

interface CommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

interface RegisteredItem {
  value: string
  id: string
  onSelect: () => void
  active: boolean
}

export function Command({ open: controlledOpen, onOpenChange, children }: CommandProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [itemCount, setItemCount] = useState(0)

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [controlledOpen, onOpenChange],
  )

  useEffect(() => {
    if (!open) {
      setHighlightedId(null)
      setQuery("")
    }
  }, [open])

  const highlightedRef = useRef(highlightedId)
  highlightedRef.current = highlightedId

  const listId = useId()
  const itemsRef = useRef<RegisteredItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const registerItem = useCallback((value: string, id: string, onSelect: () => void) => {
    if (itemsRef.current.some((i) => i.value === value)) return
    itemsRef.current.push({ value, id, onSelect, active: false })
  }, [])

  const unregisterItem = useCallback((value: string) => {
    const item = itemsRef.current.find((i) => i.value === value)
    if (!item) return
    if (item.active) {
      setItemCount((c) => c - 1)
      if (highlightedRef.current === item.id) setHighlightedId(null)
    }
    itemsRef.current = itemsRef.current.filter((i) => i.value !== value)
  }, [])

  const setItemActive = useCallback((value: string, active: boolean) => {
    const item = itemsRef.current.find((i) => i.value === value)
    if (!item || item.active === active) return
    item.active = active
    setItemCount((c) => c + (active ? 1 : -1))
    if (!active && highlightedRef.current === item.id) setHighlightedId(null)
  }, [])

  useLayoutEffect(() => {
    if (!query) {
      setHighlightedId(null)
      return
    }
    setHighlightedId(itemsRef.current.find((i) => i.active)?.id ?? null)
  }, [query])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.isComposing) return
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
        return
      }
      if (!open) return
      const list = itemsRef.current.filter((i) => i.active)
      const current = highlightedRef.current
      const idx = list.findIndex((i) => i.id === (current ?? ""))

      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        const next = idx < list.length - 1 ? list[idx + 1] : list[0]
        if (next !== undefined) setHighlightedId(next.id)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prev = idx > 0 ? list[idx - 1] : list[list.length - 1]
        if (prev !== undefined) setHighlightedId(prev.id)
      } else if (e.key === "Enter") {
        const item = list.find((i) => i.id === (current ?? ""))
        if (item) {
          e.preventDefault()
          item.onSelect()
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, setOpen])

  const ctx: CommandContextValue = useMemo(
    () => ({
      open,
      setOpen,
      query,
      setQuery,
      highlightedId,
      setHighlightedId,
      registerItem,
      unregisterItem,
      setItemActive,
      itemCount,
      inputRef,
      listId,
    }),
    [open, setOpen, query, highlightedId, registerItem, unregisterItem, setItemActive, itemCount, listId],
  )

  return <CommandContext.Provider value={ctx}>{children}</CommandContext.Provider>
}
