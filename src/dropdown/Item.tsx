import { type HTMLAttributes, type ReactNode } from 'react'
import { useDropdown } from './context'

interface ItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  value: string
  disabled?: boolean
  children: ReactNode
}

export function Item({ value, disabled = false, children, ...rest }: ItemProps) {
  const { selectedValues, onSelect } = useDropdown()

  const isSelected = selectedValues.has(value)

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
      onClick={handleClick}
    >
      {children}
    </div>
  )
}
