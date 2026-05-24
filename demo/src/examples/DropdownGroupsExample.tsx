import { useState } from "react"
import { Content, Dropdown, Group, Item, Separator, Trigger } from "../../../src/dropdown"

const DropdownGroupsExample = () => {
  const [value, setValue] = useState<string | undefined>(undefined)
  return (
    <Dropdown value={value} onValueChange={setValue}>
      <Trigger className="inline-flex h-9 w-full items-center justify-between rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-700 hover:border-zinc-400 hover:text-zinc-900 data-[state=open]:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-100 dark:data-[state=open]:border-zinc-500">
        {value ?? "Select language…"}
      </Trigger>
      <Content className="z-50 overflow-hidden rounded-lg border border-zinc-200 bg-white p-1 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <Group
          label="Frontend"
          labelClassName="block px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600"
        >
          {["React", "Vue", "Svelte"].map((v) => (
            <Item
              key={v}
              value={v}
              className="flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none text-zinc-700 dark:text-zinc-300 data-[highlighted]:bg-zinc-100 data-[highlighted]:text-zinc-900 dark:data-[highlighted]:bg-zinc-700/60 dark:data-[highlighted]:text-zinc-100"
            >
              {v}
            </Item>
          ))}
        </Group>
        <Separator className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
        <Group
          label="Backend"
          labelClassName="block px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600"
        >
          {["Node.js", "Go", "Python"].map((v) => (
            <Item
              key={v}
              value={v}
              className="flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none text-zinc-700 dark:text-zinc-300 data-[highlighted]:bg-zinc-100 data-[highlighted]:text-zinc-900 dark:data-[highlighted]:bg-zinc-700/60 dark:data-[highlighted]:text-zinc-100"
            >
              {v}
            </Item>
          ))}
        </Group>
      </Content>
    </Dropdown>
  )
}

export default DropdownGroupsExample
