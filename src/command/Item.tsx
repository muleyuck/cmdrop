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
  const { query, highlightedValue, registerItem, unregisterItem } = useCommand()
  const groupCtx = useGroupContext()

  const value = valueProp ?? (typeof children === "string" ? children : "")
  const isHighlighted = value !== "" && highlightedValue === value
  const isVisible = !query || value === "" || value.toLowerCase().includes(query.toLowerCase())

  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useLayoutEffect(() => {
    if (!value || !isVisible) {
      return
    }
    if (!disabled) {
      registerItem(value, () => onSelectRef.current())
    }
    groupCtx?.notifyVisible(value, true)
    return () => {
      if (!disabled) {
        unregisterItem(value)
      }
      groupCtx?.notifyVisible(value, false)
    }
  }, [value, disabled, isVisible, registerItem, unregisterItem, groupCtx])

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
