import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useDropdown } from './context'

interface TriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function Trigger({ children, onClick, ...rest }: TriggerProps) {
  const { open, setOpen, triggerId, contentId, triggerRef } = useDropdown()

  return (
    <button
      ref={triggerRef}
      id={triggerId}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      data-cmdrop-trigger=""
      data-state={open ? 'open' : 'closed'}
      onClick={(e) => {
        setOpen(!open)
        onClick?.(e)
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
