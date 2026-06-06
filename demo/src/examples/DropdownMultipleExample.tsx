import { useState } from "react"
import { Content, Dropdown, Item, Trigger } from "../../../src/dropdown"

const DropdownMultipleExample = () => {
  const [tags, setTags] = useState<string[]>([])
  return (
    <Dropdown multiple value={tags} onValueChange={setTags}>
      <Trigger className="inline-flex h-9 w-full items-center justify-between rounded-lg border border-zinc-300 bg-white px-3 text-zinc-700 hover:border-zinc-400 hover:text-zinc-900 data-[state=open]:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:data-[state=open]:border-zinc-500 dark:hover:border-zinc-600 dark:hover:text-zinc-100">
        {tags.length > 0 ? `${tags.length} selected` : "Select tags…"}
      </Trigger>
      <Content className="z-50 overflow-hidden rounded-lg border border-zinc-200 bg-white p-1 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        {["TypeScript", "Accessibility", "Animation", "Dark mode"].map((tag) => (
          <Item
            key={tag}
            value={tag}
            className="flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-zinc-700 outline-none data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900 dark:text-zinc-300 dark:data-highlighted:bg-zinc-700/60 dark:data-highlighted:text-zinc-100"
          >
            <span className="w-3.5 text-indigo-500 dark:text-indigo-400">{tags.includes(tag) ? "✓" : ""}</span>
            {tag}
          </Item>
        ))}
      </Content>
    </Dropdown>
  )
}

export default DropdownMultipleExample
