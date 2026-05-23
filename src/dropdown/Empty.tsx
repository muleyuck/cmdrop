import type { HTMLAttributes, ReactNode } from "react"
import { useDropdown } from "./context"
import { matchesQuery } from "./utils"

interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const Empty = ({ children, ...rest }: EmptyProps) => {
  const { items, filterable, query } = useDropdown()

  if (!filterable || !query || items.current.some((item) => matchesQuery(item.value, query))) return null

  return (
    <div {...rest} aria-live="polite">
      {children}
    </div>
  )
}
