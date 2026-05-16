import type { HTMLAttributes, ReactNode } from "react"
import { useCommand } from "./context"

interface ListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function List({ children, ...rest }: ListProps) {
  const { listId } = useCommand()
  return (
    <div id={listId} role="listbox" tabIndex={-1} {...rest}>
      {children}
    </div>
  )
}
