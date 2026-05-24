import type { InputHTMLAttributes } from "react"
import { useCommand } from "./context"

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = ({ onChange, ...props }: InputProps) => {
  const { setQuery, inputRef, listId, highlightedId } = useCommand()

  return (
    <input
      ref={inputRef}
      aria-controls={listId}
      aria-activedescendant={highlightedId ?? undefined}
      aria-autocomplete="list"
      onChange={(e) => {
        setQuery(e.target.value)
        onChange?.(e)
      }}
      {...props}
    />
  )
}
