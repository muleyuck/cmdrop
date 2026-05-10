import { type HTMLAttributes, type ReactNode, useId } from "react"

interface GroupProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  labelClassName?: string
  children: ReactNode
}

export function Group({ label, labelClassName, children, ...rest }: GroupProps) {
  const labelId = useId()

  return (
    // biome-ignore lint/a11y/useSemanticElements: <fieldset> is for form groups; div[role="group"] is correct for ARIA listbox option groups
    <div {...rest} role="group" aria-labelledby={label ? labelId : undefined}>
      {label && (
        <span id={labelId} className={labelClassName}>
          {label}
        </span>
      )}
      {children}
    </div>
  )
}
