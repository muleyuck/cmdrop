import type { ReactNode } from "react"
import { useHighlight as useHighlightBase } from "../shared/useHighlight"
import { useCommand } from "./context"

interface UseHighlightOptions {
  className?: string | undefined
}

export function useHighlight({ className }: UseHighlightOptions = {}): (text: string) => ReactNode {
  const { query } = useCommand()
  return useHighlightBase({ query, className })
}
