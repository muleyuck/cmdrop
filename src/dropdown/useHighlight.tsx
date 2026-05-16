import type { ReactNode } from "react"
import { useHighlight as useHighlightBase } from "../shared/useHighlight"
import { useDropdown } from "./context"

interface UseHighlightOptions {
  className?: string | undefined
}

export function useHighlight({ className }: UseHighlightOptions = {}): (text: string) => ReactNode {
  const { query } = useDropdown()
  return useHighlightBase({ query, className })
}
