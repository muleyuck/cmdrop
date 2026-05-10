import type { HTMLAttributes, ReactNode } from "react"
import { createContext, useCallback, useContext, useId, useMemo, useRef, useState } from "react"

interface GroupContextValue {
  notifyVisible: (value: string, visible: boolean) => void
}

const GroupContext = createContext<GroupContextValue | null>(null)

export function useGroupContext(): GroupContextValue | null {
  return useContext(GroupContext)
}

interface GroupProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  labelClassName?: string
  forceMount?: boolean
  children: ReactNode
}

export function Group({ label, labelClassName, forceMount = false, children, ...rest }: GroupProps) {
  const labelId = useId()
  const visibleItemsRef = useRef(new Set<string>())
  const [isHidden, setIsHidden] = useState(false)

  const notifyVisible = useCallback(
    (value: string, visible: boolean) => {
      if (forceMount) return
      const wasEmpty = visibleItemsRef.current.size === 0
      if (visible) {
        visibleItemsRef.current.add(value)
      } else {
        visibleItemsRef.current.delete(value)
      }
      const isEmpty = visibleItemsRef.current.size === 0
      if (wasEmpty !== isEmpty) {
        setIsHidden(isEmpty)
      }
    },
    [forceMount],
  )

  const ctx = useMemo(() => ({ notifyVisible }), [notifyVisible])

  return (
    <GroupContext.Provider value={ctx}>
      {/* biome-ignore lint/a11y/useSemanticElements: <fieldset> is for form groups; div[role="group"] is correct for ARIA listbox option groups */}
      <div
        {...rest}
        role="group"
        aria-labelledby={label ? labelId : undefined}
        hidden={(!forceMount && isHidden) || undefined}
      >
        {label && (
          <span id={labelId} className={labelClassName}>
            {label}
          </span>
        )}
        {children}
      </div>
    </GroupContext.Provider>
  )
}
