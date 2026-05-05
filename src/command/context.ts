import { createContext, useContext } from "react"

export interface CommandContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

export const CommandContext = createContext<CommandContextValue | null>(null)

export function useCommand(): CommandContextValue {
  const ctx = useContext(CommandContext)
  if (ctx === null) {
    throw new Error("useCommand must be used within a Command component")
  }
  return ctx
}
