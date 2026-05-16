export function applyFilter<T extends { value: string }>(items: T[], filterable: boolean, query: string): T[] {
  if (!filterable || !query) return items
  const q = query.toLowerCase()
  return items.filter((item) => item.value.toLowerCase().includes(q))
}
