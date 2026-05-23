import { type ReactNode, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react"
import { DropdownContext, type DropdownContextValue, type PendingDirection } from "./context"
import { matchesQuery } from "./utils"

interface DropdownBaseProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  filterable?: boolean
  children: ReactNode
}

export interface DropdownSingleProps extends DropdownBaseProps {
  multiple?: false
  value?: string
  onValueChange?: (value: string) => void
}

export interface DropdownMultipleProps extends DropdownBaseProps {
  multiple: true
  value?: string[]
  onValueChange?: (value: string[]) => void
}

export type DropdownProps = DropdownSingleProps | DropdownMultipleProps

const toSet = (v: string | string[] | undefined): Set<string> => {
  if (v === undefined) return new Set()
  return new Set(Array.isArray(v) ? v : [v])
}

export const Dropdown = (props: DropdownProps) => {
  const { open: controlledOpen, onOpenChange, filterable = false, children } = props

  const triggerId = useId()
  const contentId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const items = useRef<{ value: string; id: string }[]>([])
  const itemCallbacks = useRef(new Map<string, () => void>())
  const pendingDirection = useRef<PendingDirection>(null)

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(next)
      }
      onOpenChange?.(next)
    },
    [controlledOpen, onOpenChange],
  )

  useEffect(() => {
    if (!open) {
      setHighlightedId(null)
      setQuery("")
    }
  }, [open])

  useLayoutEffect(() => {
    if (!filterable || !query) {
      setHighlightedId(null)
      return
    }
    const first = items.current.find((item) => matchesQuery(item.value, query))
    setHighlightedId(first?.id ?? null)
  }, [query, filterable])

  const isControlled = props.value !== undefined
  const [internalValues, setInternalValues] = useState<Set<string>>(new Set())
  const selectedValues = isControlled ? toSet(props.value) : internalValues
  const multiple = props.multiple ?? false

  // Keep latest props and selectedValues in refs to stabilize onSelect reference
  const latestProps = useRef(props)
  latestProps.current = props
  const latestSelectedValues = useRef(selectedValues)
  latestSelectedValues.current = selectedValues

  const onSelect = useCallback(
    (value: string) => {
      const p = latestProps.current
      const current = latestSelectedValues.current
      const controlled = p.value !== undefined
      if (p.multiple) {
        const next = new Set(current)
        if (next.has(value)) {
          next.delete(value)
        } else {
          next.add(value)
        }
        if (!controlled) {
          setInternalValues(next)
        }
        p.onValueChange?.([...next])
      } else {
        if (!controlled) {
          setInternalValues(new Set([value]))
        }
        p.onValueChange?.(value)
        setOpen(false)
      }
    },
    [setOpen],
  )

  const ctx: DropdownContextValue = useMemo(
    () => ({
      open,
      setOpen,
      triggerId,
      contentId,
      triggerRef,
      contentRef,
      selectedValues,
      multiple,
      onSelect,
      highlightedId,
      setHighlightedId,
      items,
      itemCallbacks,
      pendingDirection,
      filterable,
      query,
      setQuery,
    }),
    [open, setOpen, triggerId, contentId, selectedValues, multiple, onSelect, highlightedId, filterable, query],
  )

  return <DropdownContext.Provider value={ctx}>{children}</DropdownContext.Provider>
}
