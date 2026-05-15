import type { HTMLAttributes, ReactNode } from "react"
import { useDropdown } from "./context"
import { applyFilter } from "./utils"

interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Empty({ children, ...rest }: EmptyProps) {
  const { items, filterable, query } = useDropdown()

  if ((filterable && !query) || applyFilter(items.current, filterable, query).length > 0) return null

  return (
    <div {...rest} aria-live="polite">
      {children}
    </div>
  )
}
