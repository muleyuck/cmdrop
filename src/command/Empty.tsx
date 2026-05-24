import type { HTMLAttributes, ReactNode } from "react"
import { useCommand } from "./context"
import { matchesQuery } from "./utils"

interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const Empty = ({ children, ...rest }: EmptyProps) => {
  const { registeredCount, items, query } = useCommand()

  if (registeredCount === 0 || !query || items.current.some((i) => matchesQuery(i.value, query))) {
    return null
  }

  return (
    <div {...rest} aria-live="polite">
      {children}
    </div>
  )
}
