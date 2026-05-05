import type { HTMLAttributes } from "react"

type SeparatorProps = HTMLAttributes<HTMLHRElement>

export function Separator({ ...rest }: SeparatorProps) {
  return <hr {...rest} data-cmdrop-command-separator="" />
}
