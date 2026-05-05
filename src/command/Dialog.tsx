import { type HTMLAttributes, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { useCommand } from "./context"

interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  shortcut?: string
}

export function Dialog({ children, shortcut: _shortcut, ...rest }: DialogProps) {
  const { open } = useCommand()

  if (!open) return null

  return createPortal(
    <div data-cmdrop-command-overlay="">
      <div role="dialog" aria-modal="true" data-cmdrop-command-dialog="" {...rest}>
        {children}
      </div>
    </div>,
    document.body,
  )
}
