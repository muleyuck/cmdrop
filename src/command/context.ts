import type { RefObject } from "react"
import { createContext, useContext } from "react"

export interface CommandContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  query: string
  setQuery: (query: string) => void
  highlightedId: string | null
  setHighlightedId: (value: string | null) => void
  registerItem: (value: string, id: string, onSelect: () => void) => void
  unregisterItem: (value: string) => void
  setItemActive: (value: string, active: boolean) => void
  itemCount: number
  inputRef: RefObject<HTMLInputElement | null>
  listId: string
}

export const CommandContext = createContext<CommandContextValue | null>(null)

export function useCommand(): CommandContextValue {
  const ctx = useContext(CommandContext)
  if (ctx === null) {
    throw new Error("useCommand must be used within a Command component")
  }
  return ctx
}
