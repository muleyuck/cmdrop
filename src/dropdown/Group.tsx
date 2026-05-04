import { useId, type HTMLAttributes, type ReactNode } from 'react'

interface GroupProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  children: ReactNode
}

export function Group({ label, children, ...rest }: GroupProps) {
  const labelId = useId()

  return (
    <div
      {...rest}
      role="group"
      aria-labelledby={label ? labelId : undefined}
      data-cmdrop-group=""
    >
      {label && (
        <span id={labelId} data-cmdrop-group-label="">
          {label}
        </span>
      )}
      {children}
    </div>
  )
}
