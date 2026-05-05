import { type HTMLAttributes, type ReactNode } from "react"

interface ItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  onSelect: () => void
  disabled?: boolean
  children: ReactNode
}

export function Item({ onSelect, disabled = false, children, ...rest }: ItemProps) {
  return (
    <div
      role="option"
      aria-disabled={disabled || undefined}
      data-cmdrop-command-item=""
      onClick={() => { if (!disabled) onSelect() }}
      {...rest}
    >
      {children}
    </div>
  )
}
