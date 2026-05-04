import { createContext, useContext, type RefObject, type MutableRefObject } from 'react'

export interface DropdownContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerId: string
  contentId: string
  triggerRef: RefObject<HTMLButtonElement | null>
  contentRef: RefObject<HTMLDivElement | null>
  selectedValues: Set<string>
  multiple: boolean
  onSelect: (value: string) => void
  highlightedValue: string | null
  setHighlightedValue: (value: string | null) => void
  items: MutableRefObject<string[]>
  pendingDirection: MutableRefObject<'first' | 'last' | null>
}

export const DropdownContext = createContext<DropdownContextValue | null>(null)

export function useDropdown(): DropdownContextValue {
  const ctx = useContext(DropdownContext)
  if (ctx === null) {
    throw new Error('useDropdown must be used within a Dropdown component')
  }
  return ctx
}
