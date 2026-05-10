import type { HTMLAttributes, ReactNode } from "react"

interface ListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function List({ children, ...rest }: ListProps) {
  return (
    <div role="listbox" {...rest}>
      {children}
    </div>
  )
}
