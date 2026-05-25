import { useState } from "react"
import {
  Command,
  Dialog,
  Empty,
  Group,
  Input,
  Item,
  List,
  Overlay,
  Separator,
  useHighlight,
} from "../../../src/command"

const CommandContent = ({ onClose }: { onClose: () => void }) => {
  const highlight = useHighlight({ className: "text-zinc-900 font-semibold dark:text-zinc-100" })

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <Input
        className="w-full border-b border-zinc-200 bg-transparent px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600"
        placeholder="Search commands…"
      />
      <List className="max-h-72 overflow-y-auto p-1.5">
        <Group
          label="Navigation"
          labelClassName="block px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-600"
        >
          <Item
            value="Home"
            className="flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none text-zinc-700 dark:text-zinc-300 data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900 dark:data-highlighted:bg-zinc-700/60 dark:data-highlighted:text-zinc-100 aria-disabled:opacity-40 aria-disabled:pointer-events-none"
            onSelect={() => {
              window.scrollTo({ top: 0, behavior: "smooth" })
              onClose()
            }}
          >
            {highlight("Home")}
          </Item>
          <Item
            value="Dropdown"
            className="flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none text-zinc-700 dark:text-zinc-300 data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900 dark:data-highlighted:bg-zinc-700/60 dark:data-highlighted:text-zinc-100 aria-disabled:opacity-40 aria-disabled:pointer-events-none"
            onSelect={() => {
              scrollTo("dropdown")
              onClose()
            }}
          >
            {highlight("Dropdown")}
          </Item>
          <Item
            value="Command Palette"
            className="flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none text-zinc-700 dark:text-zinc-300 data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900 dark:data-highlighted:bg-zinc-700/60 dark:data-highlighted:text-zinc-100 aria-disabled:opacity-40 aria-disabled:pointer-events-none"
            onSelect={() => {
              scrollTo("command")
              onClose()
            }}
          >
            {highlight("Command Palette")}
          </Item>
          <Item
            value="Open GitHub"
            className="flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none text-zinc-700 dark:text-zinc-300 data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900 dark:data-highlighted:bg-zinc-700/60 dark:data-highlighted:text-zinc-100 aria-disabled:opacity-40 aria-disabled:pointer-events-none"
            onSelect={() => {
              onClose()
              window.open("https://github.com/muleyuck/cmdrop", "_blank")
            }}
          >
            {highlight("Open GitHub")}
          </Item>
        </Group>
        <Separator className="my-1.5 border-t border-zinc-200 dark:border-zinc-800" />
        <Group
          label="Actions"
          labelClassName="block px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-600"
        >
          <Item
            value="Copy install command"
            className="flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none text-zinc-700 dark:text-zinc-300 data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900 dark:data-highlighted:bg-zinc-700/60 dark:data-highlighted:text-zinc-100 aria-disabled:opacity-40 aria-disabled:pointer-events-none"
            onSelect={async () => {
              await navigator.clipboard.writeText("npx shadcn add https://muleyuck.github.io/cmdrop/registry.json")
              onClose()
            }}
          >
            {highlight("Copy install command")}
          </Item>
        </Group>
      </List>
      <Empty className="py-8 text-center text-sm text-zinc-400 dark:text-zinc-600">No results found.</Empty>
      <div className="flex items-center gap-3 border-t border-zinc-200 px-4 py-2 text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-700">
        <span>
          <kbd className="font-mono">↑↓</kbd> navigate
        </span>
        <span>
          <kbd className="font-mono">↵</kbd> select
        </span>
        <span>
          <kbd className="font-mono">esc</kbd> close
        </span>
      </div>
    </>
  )
}

const CommandDialogExample = () => {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-center gap-3 py-10">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-700 shadow-sm hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
      >
        Open command palette
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
            ⌘K
          </kbd>
          <span className="text-zinc-300 dark:text-zinc-600">/</span>
          <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
            Ctrl K
          </kbd>
        </span>
      </button>
      <Command open={open} onOpenChange={setOpen}>
        <Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm dark:bg-black/60" />
        <Dialog
          aria-label="Command palette"
          className="fixed left-1/2 top-[15vh] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700/60 dark:bg-zinc-900"
        >
          <CommandContent onClose={() => setOpen(false)} />
        </Dialog>
      </Command>
    </div>
  )
}

export default CommandDialogExample
