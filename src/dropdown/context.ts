import { createContext, type RefObject, useContext } from "react"

export type PendingDirection = "first" | "last" | null

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
  items: RefObject<DropdownItem[]>
  itemCallbacks: RefObject<Map<string, () => void>>
  pendingDirection: RefObject<PendingDirection>
  filterable: boolean
  query: string
  setQuery: (query: string) => void
}

export const DropdownContext = createContext<DropdownContextValue | null>(null)

export const useDropdown = (): DropdownContextValue => {
  const ctx = useContext(DropdownContext)
  if (ctx === null) {
    throw new Error("useDropdown must be used within a Dropdown component")
  }
  return ctx
}
