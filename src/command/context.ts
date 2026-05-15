import type { RefObject } from "react"
import { createContext, useContext } from "react"

export interface CommandContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  query: string
  setQuery: (query: string) => void
  highlightedValue: string | null
  setHighlightedValue: (value: string | null) => void
  registerItem: (value: string, onSelect: () => void) => void
  unregisterItem: (value: string) => void
  setItemActive: (value: string, active: boolean) => void
  itemCount: number
  inputRef: RefObject<HTMLInputElement | null>
}

export const CommandContext = createContext<CommandContextValue | null>(null)

export function useCommand(): CommandContextValue {
  const ctx = useContext(CommandContext)
  if (ctx === null) {
    throw new Error("useCommand must be used within a Command component")
  }
  return ctx
}
