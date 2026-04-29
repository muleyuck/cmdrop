import { createContext, useContext } from 'react'

export interface DropdownContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerId: string
  contentId: string
}

export const DropdownContext = createContext<DropdownContextValue | null>(null)

export function useDropdown(): DropdownContextValue {
  const ctx = useContext(DropdownContext)
  if (ctx === null) {
    throw new Error('useDropdown must be used within a Dropdown component')
  }
  return ctx
}
