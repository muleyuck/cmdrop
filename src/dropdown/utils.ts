export function applyFilter(items: string[], filterable: boolean, query: string): string[] {
  if (!filterable || !query) return items
  const q = query.toLowerCase()
  return items.filter((v) => v.toLowerCase().includes(q))
}
