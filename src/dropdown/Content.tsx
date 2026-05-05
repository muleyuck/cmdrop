import { type HTMLAttributes, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useDropdown } from "./context"

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
    highlightedValue,
    setHighlightedValue,
    items,
    onSelect,
    pendingDirection,
  } = useDropdown()

  const [pos, setPos] = useState<Position>({
    top: 0,
    left: 0,
    width: 0,
    side: "bottom",
    ready: false,
  })

  // Calculate position before paint to avoid flicker
  // biome-ignore lint/correctness/useExhaustiveDependencies: triggerRef/contentRef are stable refs; .current is intentionally excluded per React ref convention
  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !contentRef.current) {
      setPos((p) => ({ ...p, ready: false }))
      return
    }
    const trigger = triggerRef.current.getBoundingClientRect()
    const content = contentRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - trigger.bottom

    const side: "top" | "bottom" = spaceBelow >= content.height || spaceBelow >= trigger.top ? "bottom" : "top"
    const top = side === "bottom" ? trigger.bottom : trigger.top - content.height

    setPos({
      top,
      left: trigger.left,
      width: trigger.width,
      side,
      ready: true,
    })
  }, [open])

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
    const list = items.current
    const target = pendingDirection.current === "first" ? list[0] : list[list.length - 1]
    if (target !== undefined) setHighlightedValue(target)
    pendingDirection.current = null
  }, [open, items, pendingDirection, setHighlightedValue])

  // Keep latest highlightedValue in ref to avoid re-registering listener on every navigation step
  const highlightedRef = useRef(highlightedValue)
  highlightedRef.current = highlightedValue

  // Keyboard navigation — registered only while open, removed on close/unmount
  useEffect(() => {
    if (!open) return
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.isComposing) return
      const list = items.current
      const current = highlightedRef.current
      const idx = list.indexOf(current ?? "")
      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        const next = idx < list.length - 1 ? list[idx + 1] : list[0]
        if (next !== undefined) setHighlightedValue(next)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prev = idx > 0 ? list[idx - 1] : list[list.length - 1]
        if (prev !== undefined) setHighlightedValue(prev)
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (current !== null) onSelect(current)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, setOpen, triggerRef, items, onSelect, setHighlightedValue])

  if (!open) return null

  return createPortal(
    <div
      ref={contentRef}
      id={contentId}
      role="listbox"
      aria-labelledby={triggerId}
      tabIndex={-1}
      data-cmdrop-content=""
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
