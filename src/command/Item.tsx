import type { HTMLAttributes, ReactNode } from "react"
import { useLayoutEffect, useRef } from "react"
import { useCommand } from "./context"
import { useGroupContext } from "./Group"

interface ItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  onSelect: () => void
  value?: string
  disabled?: boolean
  children: ReactNode
}

export function Item({ onSelect, value: valueProp, disabled = false, children, ...rest }: ItemProps) {
  const { query, highlightedValue, registerItem, unregisterItem, setItemActive } = useCommand()
  const groupCtx = useGroupContext()

  const value = valueProp ?? (typeof children === "string" ? children : "")
  const isHighlighted = value !== "" && highlightedValue === value
  const isVisible = !query || value === "" || value.toLowerCase().includes(query.toLowerCase())

  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  // Lifecycle: register on mount, unregister on unmount
  useLayoutEffect(() => {
    if (!value || disabled) return
    registerItem(value, () => onSelectRef.current())
    return () => unregisterItem(value)
  }, [value, disabled, registerItem, unregisterItem])

  // Visibility: toggle active and notify Group
  useLayoutEffect(() => {
    if (!value || disabled) return
    setItemActive(value, isVisible)
    groupCtx?.notifyVisible(value, isVisible)
    return () => groupCtx?.notifyVisible(value, false)
  }, [value, isVisible, disabled, setItemActive, groupCtx])

  if (!isVisible) return null

  return (
    <div
      role="option"
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      {...(isHighlighted ? { "data-highlighted": "" } : {})}
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
