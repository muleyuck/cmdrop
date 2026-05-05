import type { HTMLAttributes, ReactNode } from "react"
import { useEffect, useRef } from "react"
import { useCommand } from "./context"

interface ItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  onSelect: () => void
  disabled?: boolean
  children: ReactNode
}

export function Item({ onSelect, disabled = false, children, ...rest }: ItemProps) {
  const { query, highlightedValue, registerItem, unregisterItem } = useCommand()

  const value = typeof children === "string" ? children : ""
  const isHighlighted = value !== "" && highlightedValue === value

  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    if (!value || disabled) return
    registerItem(value, () => onSelectRef.current())
    return () => unregisterItem(value)
  }, [value, disabled, registerItem, unregisterItem])

  if (query && typeof children === "string" && !children.toLowerCase().includes(query.toLowerCase())) {
    return null
  }

  return (
    <div
      role="option"
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      data-cmdrop-command-item=""
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
