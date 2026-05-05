import type { HTMLAttributes, ReactNode } from "react"

interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Empty({ children, ...rest }: EmptyProps) {
  return (
    <div {...rest} data-cmdrop-empty="" aria-live="polite">
      {children}
    </div>
  )
}
