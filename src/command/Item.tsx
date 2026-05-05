import type { HTMLAttributes, ReactNode } from "react"
import { useCommand } from "./context"

interface ItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  onSelect: () => void
  disabled?: boolean
  children: ReactNode
}

export function Item({ onSelect, disabled = false, children, ...rest }: ItemProps) {
  const { query } = useCommand()

  if (query && typeof children === "string" && !children.toLowerCase().includes(query.toLowerCase())) {
    return null
  }

  return (
    <div
      role="option"
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      data-cmdrop-command-item=""
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
