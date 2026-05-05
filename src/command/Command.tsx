import { useState, useCallback, useMemo, type ReactNode } from "react"
import { CommandContext, type CommandContextValue } from "./context"

interface CommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function Command({ open: controlledOpen, onOpenChange, children }: CommandProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [controlledOpen, onOpenChange],
  )

  const ctx: CommandContextValue = useMemo(() => ({ open, setOpen }), [open, setOpen])

  return <CommandContext.Provider value={ctx}>{children}</CommandContext.Provider>
}
