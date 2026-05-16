import { type HTMLAttributes, type KeyboardEvent, type ReactNode, useEffect, useId, useRef } from "react"
import { useDropdown } from "./context"

interface ItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick" | "onKeyDown"> {
  value: string
  disabled?: boolean
  onSelect?: () => void
  children: ReactNode
}

export function Item({ value, disabled = false, onSelect: onSelectProp, children, ...rest }: ItemProps) {
  const { selectedValues, onSelect, highlightedId, setHighlightedId, items, itemCallbacks, filterable, query } =
    useDropdown()
  const id = useId()

  const isVisible = !filterable || !query || value.toLowerCase().includes(query.toLowerCase())
  const isSelected = selectedValues.has(value)
  const isHighlighted = highlightedId === id

  const onSelectRef = useRef(onSelectProp)
  onSelectRef.current = onSelectProp

  // Register this item for keyboard navigation; remove on unmount or when disabled changes
  useEffect(() => {
    if (disabled) return
    if (!items.current.some((item) => item.value === value)) {
      items.current.push({ value, id })
    }
    itemCallbacks.current.set(value, () => onSelectRef.current?.())
    return () => {
      items.current = items.current.filter((item) => item.value !== value)
      itemCallbacks.current.delete(value)
    }
  }, [value, disabled, id, items, itemCallbacks])

  if (!isVisible) return null

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
      id={id}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? undefined : -1}
      {...(isSelected ? { "data-selected": "" } : {})}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...(isHighlighted ? { "data-highlighted": "" } : {})}
      onPointerMove={(e) => {
        if (!disabled && (e.movementX !== 0 || e.movementY !== 0)) setHighlightedId(id)
      }}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  )
}
