import { createContext, type MutableRefObject, type RefObject, useContext } from "react"

export interface DropdownItem {
  value: string
  id: string
}

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
  highlightedId: string | null
  setHighlightedId: (value: string | null) => void
  items: MutableRefObject<DropdownItem[]>
  itemCallbacks: MutableRefObject<Map<string, () => void>>
  pendingDirection: MutableRefObject<"first" | "last" | null>
  filterable: boolean
  query: string
  setQuery: (query: string) => void
}

export const DropdownContext = createContext<DropdownContextValue | null>(null)

export function useDropdown(): DropdownContextValue {
  const ctx = useContext(DropdownContext)
  if (ctx === null) {
    throw new Error("useDropdown must be used within a Dropdown component")
  }
  return ctx
}
