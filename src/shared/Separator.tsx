import type { HTMLAttributes } from "react"

type SeparatorProps = HTMLAttributes<HTMLHRElement>

export const Separator = ({ ...rest }: SeparatorProps) => {
  return <hr {...rest} />
}
