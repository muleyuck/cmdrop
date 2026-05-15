import type { InputHTMLAttributes } from "react"
import { useDropdown } from "./context"

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ onChange, value, ...props }: InputProps) {
  const { query, setQuery } = useDropdown()

  return (
    <input
      role="searchbox"
      value={value ?? query}
      onChange={(e) => {
        setQuery(e.target.value)
        onChange?.(e)
      }}
      {...props}
    />
  )
}
