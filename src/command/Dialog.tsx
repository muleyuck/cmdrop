import type { HTMLAttributes, ReactNode } from "react"
import { useEffect } from "react"
import { createPortal } from "react-dom"
import { useCommand } from "./context"

interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Reserved for displaying a keyboard shortcut label in the dialog UI. Not yet rendered. */
  shortcut?: string
  autoFocus?: boolean
}

export const Dialog = ({ children, shortcut: _shortcut, autoFocus = true, ...rest }: DialogProps) => {
  const { open, inputRef } = useCommand()

  useEffect(() => {
    if (!open || !autoFocus) {
      return
    }
    inputRef.current?.focus()
  }, [open, autoFocus, inputRef])

  if (!open) {
    return null
  }

  return createPortal(
    <div role="dialog" aria-modal="true" {...rest}>
      {children}
    </div>,
    document.body,
  )
}
