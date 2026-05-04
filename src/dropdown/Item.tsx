import { useEffect, type HTMLAttributes, type ReactNode } from 'react'
import { useDropdown } from './context'

interface ItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  value: string
  disabled?: boolean
  children: ReactNode
}

export function Item({ value, disabled = false, children, ...rest }: ItemProps) {
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

  const handleClick = () => {
    if (disabled) return
    onSelect(value)
  }

  return (
    <div
      {...rest}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      data-cmdrop-item=""
      {...(isSelected ? { 'data-selected': '' } : {})}
      {...(disabled ? { 'data-disabled': '' } : {})}
      {...(isHighlighted ? { 'data-highlighted': '' } : {})}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}
