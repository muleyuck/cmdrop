import type { InputHTMLAttributes } from "react"
import { useCommand } from "./context"

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ onChange, ...props }: InputProps) {
  const { setQuery } = useCommand()

  return (
    <input
      data-cmdrop-command-input=""
      onChange={(e) => {
        setQuery(e.target.value)
        onChange?.(e)
      }}
      {...props}
    />
  )
}
