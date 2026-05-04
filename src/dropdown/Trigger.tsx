import { type ButtonHTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import { useDropdown } from './context'

interface TriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function Trigger({ children, onClick, onKeyDown, ...rest }: TriggerProps) {
  const { open, setOpen, triggerId, contentId, triggerRef, pendingDirection } = useDropdown()

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (open) { onKeyDown?.(e); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      pendingDirection.current = 'first'
      setOpen(true)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      pendingDirection.current = 'last'
      setOpen(true)
    }
    onKeyDown?.(e)
  }

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
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </button>
  )
}
