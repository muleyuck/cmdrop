import type { HTMLAttributes, ReactNode } from "react"
import { useCommand } from "./context"

interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Empty({ children, ...rest }: EmptyProps) {
  const { itemCount } = useCommand()

  if (itemCount > 0) return null

  return (
    <div {...rest} aria-live="polite">
      {children}
    </div>
  )
}
