import { type ReactNode, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react"
import { CommandContext, type CommandContextValue } from "./context"
import { matchesQuery } from "./utils"

interface CommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function Command({ open: controlledOpen, onOpenChange, children }: CommandProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [registeredCount, setRegisteredCount] = useState(0)

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

  const queryRef = useRef(query)
  queryRef.current = query

  const listId = useId()
  const itemsRef = useRef<{ value: string; id: string; onSelect: () => void }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const registerItem = useCallback((value: string, id: string, onSelect: () => void) => {
    if (itemsRef.current.some((i) => i.id === id)) return
    itemsRef.current.push({ value, id, onSelect })
    setRegisteredCount((c) => c + 1)
  }, [])

  const unregisterItem = useCallback((id: string) => {
    const item = itemsRef.current.find((i) => i.id === id)
    if (!item) return
    if (highlightedRef.current === item.id) setHighlightedId(null)
    itemsRef.current = itemsRef.current.filter((i) => i.id !== id)
    setRegisteredCount((c) => c - 1)
  }, [])

  useLayoutEffect(() => {
    if (!query) {
      setHighlightedId(null)
      return
    }
    setHighlightedId(itemsRef.current.find((i) => matchesQuery(i.value, query))?.id ?? null)
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
      const q = queryRef.current
      const list = itemsRef.current.filter((i) => !q || matchesQuery(i.value, q))
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
      registeredCount,
      items: itemsRef,
      inputRef,
      listId,
    }),
    [open, setOpen, query, highlightedId, registerItem, unregisterItem, registeredCount, listId],
  )

  return <CommandContext.Provider value={ctx}>{children}</CommandContext.Provider>
}
