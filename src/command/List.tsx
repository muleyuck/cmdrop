import type { HTMLAttributes, ReactNode } from "react"
import { useCommand } from "./context"

interface ListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function List({ children, ...rest }: ListProps) {
  const { highlightedId } = useCommand()
  return (
    <div role="listbox" aria-activedescendant={highlightedId ?? undefined} tabIndex={-1} {...rest}>
      {children}
    </div>
  )
}
