import type { HTMLAttributes } from "react"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useCommand } from "./context"

type OverlayProps = HTMLAttributes<HTMLDivElement>

export const Overlay = ({ className, ...rest }: OverlayProps) => {
  const { open, setOpen } = useCommand()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    const handler = (e: PointerEvent) => {
      if (e.target === overlayRef.current) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", handler)
    return () => document.removeEventListener("pointerdown", handler)
  }, [open, setOpen])

  if (!open) {
    return null
  }

  return createPortal(<div ref={overlayRef} role="presentation" className={className} {...rest} />, document.body)
}
