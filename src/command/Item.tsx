import type { HTMLAttributes, ReactNode } from "react"
import { useId, useLayoutEffect, useRef } from "react"
import { useCommand } from "./context"
import { useGroupContext } from "./Group"
import { matchesQuery } from "./utils"

interface ItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  onSelect: () => void
  /** Used for filtering and keyboard navigation. Defaults to the text content of `children` when omitted. */
  value?: string
  disabled?: boolean
  children: ReactNode
}

export function Item({ onSelect, value: valueProp, disabled = false, children, ...rest }: ItemProps) {
  const { query, highlightedId, setHighlightedId, registerItem, unregisterItem } = useCommand()
  const groupCtx = useGroupContext()
  const id = useId()

  const value = valueProp ?? (typeof children === "string" ? children : "")
  const isHighlighted = highlightedId === id
  const isVisible = !query || value === "" || matchesQuery(value, query)

  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useLayoutEffect(() => {
    if (!value || disabled) return
    registerItem(value, id, () => onSelectRef.current())
    return () => unregisterItem(id)
  }, [value, disabled, id, registerItem, unregisterItem])

  useLayoutEffect(() => {
    if (!value || disabled) return
    groupCtx?.notifyVisible(value, isVisible)
    return () => groupCtx?.notifyVisible(value, false)
  }, [value, isVisible, disabled, groupCtx])

  if (!isVisible) return null

  return (
    <div
      id={id}
      role="option"
      aria-selected={false}
      aria-disabled={disabled || undefined}
      tabIndex={-1}
      {...(isHighlighted ? { "data-highlighted": "" } : {})}
      onPointerMove={(e) => {
        if (!disabled && value && (e.movementX !== 0 || e.movementY !== 0)) setHighlightedId(id)
      }}
      onClick={() => {
        if (!disabled) onSelect()
      }}
      onKeyDown={(e) => {
        if (!disabled && e.key === "Enter") {
          e.preventDefault()
          onSelect()
        }
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
