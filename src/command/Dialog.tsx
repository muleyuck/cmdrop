import type { HTMLAttributes, ReactNode } from "react"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useCommand } from "./context"

interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  shortcut?: string
}

export function Dialog({ children, shortcut: _shortcut, ...rest }: DialogProps) {
  const { open, setOpen } = useCommand()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: PointerEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [open, setOpen])

  if (!open) return null

  return createPortal(
    <div data-cmdrop-command-overlay="">
      <div ref={dialogRef} role="dialog" aria-modal="true" data-cmdrop-command-dialog="" {...rest}>
        {children}
      </div>
    </div>,
    document.body,
  )
}
