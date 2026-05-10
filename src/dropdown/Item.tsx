import { type HTMLAttributes, type KeyboardEvent, type ReactNode, useEffect } from "react"
import { useDropdown } from "./context"

interface ItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick" | "onKeyDown"> {
  value: string
  disabled?: boolean
  onSelect?: () => void
  children: ReactNode
}

export function Item({ value, disabled = false, onSelect: onSelectProp, children, ...rest }: ItemProps) {
  const { selectedValues, onSelect, highlightedValue, items } = useDropdown()

  const isSelected = selectedValues.has(value)
  const isHighlighted = highlightedValue === value

  // Register this item for keyboard navigation; remove on unmount or when disabled changes
  useEffect(() => {
    if (disabled) return
    if (!items.current.includes(value)) {
      items.current.push(value)
    }
    return () => {
      items.current = items.current.filter((v) => v !== value)
    }
  }, [value, disabled, items])

  const handleSelect = () => {
    if (disabled) return
    onSelect(value)
    onSelectProp?.()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSelect()
    }
  }

  return (
    <div
      {...rest}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? undefined : -1}
      {...(isSelected ? { "data-selected": "" } : {})}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...(isHighlighted ? { "data-highlighted": "" } : {})}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  )
}
