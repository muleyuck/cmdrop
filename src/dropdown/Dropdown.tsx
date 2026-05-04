import { useId, useRef, useState, useCallback, useMemo, type ReactNode } from 'react'
import { DropdownContext, type DropdownContextValue } from './context'

interface DropdownBaseProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

interface DropdownSingleProps extends DropdownBaseProps {
  multiple?: false
  value?: string
  onValueChange?: (value: string) => void
}

interface DropdownMultipleProps extends DropdownBaseProps {
  multiple: true
  value?: string[]
  onValueChange?: (value: string[]) => void
}

type DropdownProps = DropdownSingleProps | DropdownMultipleProps

const toSet = (v: string | string[] | undefined): Set<string> => {
  if (v === undefined) return new Set()
  return new Set(Array.isArray(v) ? v : [v])
}

export function Dropdown(props: DropdownProps) {
  const { open: controlledOpen, onOpenChange, children } = props

  const triggerId = useId()
  const contentId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const [highlightedValue, setHighlightedValue] = useState<string | null>(null)
  const items = useRef<string[]>([])
  const pendingDirection = useRef<'first' | 'last' | null>(null)

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setInternalOpen(next)
      onOpenChange?.(next)
      if (!next) setHighlightedValue(null)
    },
    [controlledOpen, onOpenChange],
  )

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
        if (next.has(value)) next.delete(value)
        else next.add(value)
        if (!controlled) setInternalValues(next)
        p.onValueChange?.([...next])
      } else {
        if (!controlled) setInternalValues(new Set([value]))
        p.onValueChange?.(value)
        setOpen(false)
      }
    },
    [setOpen],
  )

  const ctx: DropdownContextValue = useMemo(
    () => ({ open, setOpen, triggerId, contentId, triggerRef, contentRef, selectedValues, multiple, onSelect, highlightedValue, setHighlightedValue, items, pendingDirection }),
    [open, setOpen, triggerId, contentId, selectedValues, multiple, onSelect, highlightedValue],
  )

  return <DropdownContext.Provider value={ctx}>{children}</DropdownContext.Provider>
}
