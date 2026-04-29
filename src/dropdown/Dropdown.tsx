import { useId, useRef, useState, useCallback, useMemo, type ReactNode } from 'react'
import { DropdownContext, type DropdownContextValue } from './context'

interface DropdownProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function Dropdown({ open: controlledOpen, onOpenChange, children }: DropdownProps) {
  const triggerId = useId()
  const contentId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [controlledOpen, onOpenChange],
  )

  const ctx: DropdownContextValue = useMemo(
    () => ({ open, setOpen, triggerId, contentId, triggerRef, contentRef }),
    [open, setOpen, triggerId, contentId],
  )

  return <DropdownContext.Provider value={ctx}>{children}</DropdownContext.Provider>
}
