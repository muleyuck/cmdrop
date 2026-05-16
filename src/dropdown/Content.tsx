import { type HTMLAttributes, type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useDropdown } from "./context"
import { applyFilter } from "./utils"

interface ContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

interface Position {
  top: number
  left: number
  width: number
  side: "top" | "bottom"
  ready: boolean
}

export function Content({ children, style, onKeyDown, ...rest }: ContentProps) {
  const {
    open,
    setOpen,
    triggerId,
    contentId,
    triggerRef,
    contentRef,
    highlightedId,
    setHighlightedId,
    items,
    itemCallbacks,
    onSelect,
    pendingDirection,
    filterable,
    query,
    multiple,
  } = useDropdown()

  const [pos, setPos] = useState<Position>({
    top: 0,
    left: 0,
    width: 0,
    side: "bottom",
    ready: false,
  })

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return
    const trigger = triggerRef.current.getBoundingClientRect()
    const content = contentRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - trigger.bottom
    const side: "top" | "bottom" = spaceBelow >= content.height || spaceBelow >= trigger.top ? "bottom" : "top"
    const top = side === "bottom" ? trigger.bottom : trigger.top - content.height
    setPos({ top, left: trigger.left, width: trigger.width, side, ready: true })
  }, [triggerRef, contentRef])

  // Calculate position before paint to avoid flicker
  useLayoutEffect(() => {
    if (!open) {
      setPos((p) => ({ ...p, ready: false }))
      return
    }
    updatePosition()
  }, [open, updatePosition])

  // Reposition on scroll (capture mode covers all ancestor scrolls)
  useEffect(() => {
    if (!open) return
    document.addEventListener("scroll", updatePosition, { capture: true, passive: true })
    return () => document.removeEventListener("scroll", updatePosition, true)
  }, [open, updatePosition])

  // Reposition on viewport resize (documentElement) and content height changes (contentRef)
  useEffect(() => {
    if (!open) return
    const observer = new ResizeObserver(updatePosition)
    observer.observe(document.documentElement)
    if (contentRef.current) observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [open, updatePosition, contentRef])

  // Close on outside click (pointerdown covers mouse and touch)
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target) || contentRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open, setOpen, triggerRef, contentRef])

  // Set initial highlight when opened via keyboard (runs after Item effects register items)
  useEffect(() => {
    if (!open || pendingDirection.current === null) return
    const list = applyFilter(items.current, filterable, query)
    const target = pendingDirection.current === "first" ? list[0] : list[list.length - 1]
    if (target !== undefined) setHighlightedId(target.id)
    pendingDirection.current = null
  }, [open, items, pendingDirection, setHighlightedId, filterable, query])

  // Keep latest highlightedId in ref to avoid re-registering listener on every navigation step
  const highlightedRef = useRef(highlightedId)
  highlightedRef.current = highlightedId

  // Keyboard navigation — registered only while open, removed on close/unmount
  useEffect(() => {
    if (!open) return
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.isComposing) return
      const list = applyFilter(items.current, filterable, query)
      const current = highlightedRef.current
      const idx = list.findIndex((item) => item.id === (current ?? ""))
      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        const next = idx < list.length - 1 ? list[idx + 1] : list[0]
        if (next !== undefined) setHighlightedId(next.id)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prev = idx > 0 ? list[idx - 1] : list[list.length - 1]
        if (prev !== undefined) setHighlightedId(prev.id)
      } else if (e.key === "Enter") {
        e.preventDefault()
        const item = list.find((i) => i.id === current)
        if (item) {
          onSelect(item.value)
          itemCallbacks.current.get(item.value)?.()
        }
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, setOpen, triggerRef, items, itemCallbacks, onSelect, setHighlightedId, filterable, query])

  if (!open) return null

  return createPortal(
    <div
      ref={contentRef}
      id={contentId}
      role="listbox"
      aria-labelledby={triggerId}
      aria-multiselectable={multiple || undefined}
      aria-activedescendant={highlightedId ?? undefined}
      tabIndex={-1}
      data-state="open"
      data-side={pos.side}
      onKeyDown={onKeyDown}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        minWidth: pos.width,
        visibility: pos.ready ? "visible" : "hidden",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>,
    document.body,
  )
}
