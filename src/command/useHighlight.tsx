import { type ReactNode, useCallback } from "react"
import { useCommand } from "./context"

interface UseHighlightOptions {
  className?: string | undefined
}

export function useHighlight({ className }: UseHighlightOptions = {}): (text: string) => ReactNode {
  const { query } = useCommand()

  return useCallback(
    (text: string): ReactNode => {
      if (!query) return text
      const idx = text.toLowerCase().indexOf(query.toLowerCase())
      if (idx === -1) return text
      return (
        <span>
          {text.slice(0, idx)}
          <span className={className}>{text.slice(idx, idx + query.length)}</span>
          {text.slice(idx + query.length)}
        </span>
      )
    },
    [query, className],
  )
}
