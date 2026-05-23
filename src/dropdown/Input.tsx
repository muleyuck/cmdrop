import type { InputHTMLAttributes } from "react"
import { useDropdown } from "./context"

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = ({ onChange, value, ...props }: InputProps) => {
  const { query, setQuery, contentId, highlightedId } = useDropdown()

  return (
    <input
      type="search"
      value={value ?? query}
      aria-controls={contentId}
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
