import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react"
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

  const openRef = useRef(open)
  openRef.current = open
  const setOpenRef = useRef(setOpen)
  setOpenRef.current = setOpen

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.isComposing) return
      if (e.key === "Escape" && openRef.current) {
        e.preventDefault()
        setOpenRef.current(false)
      } else if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenRef.current(!openRef.current)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const [query, setQuery] = useState("")

  const ctx: CommandContextValue = useMemo(() => ({ open, setOpen, query, setQuery }), [open, setOpen, query])

  return <CommandContext.Provider value={ctx}>{children}</CommandContext.Provider>
}
