import { type HTMLAttributes, type ReactNode } from "react"

interface ListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function List({ children, ...rest }: ListProps) {
  return (
    <div role="listbox" data-cmdrop-command-list="" {...rest}>
      {children}
    </div>
  )
}
