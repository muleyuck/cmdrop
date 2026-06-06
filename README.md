<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/demo/public/logo-dark.svg">
  <img width="512" src="/demo/public/logo-light.svg">
</picture>

[![unit-test](https://github.com/muleyuck/cmdrop/actions/workflows/unit-test.yml/badge.svg)](https://github.com/muleyuck/cmdrop/actions/workflows/unit-test.yml)
![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)


Unstyled, accessible **Dropdown** and **Command Palette** components distributed via the [shadcn registry](https://ui.shadcn.com/docs/registry).  
Zero external runtime dependencies — source is copied directly into your project so you style and own it completely.  

**[Demo & full examples →](https://muleyuck.github.io/cmdrop/)**

## Installation

Requires [shadcn CLI](https://ui.shadcn.com/docs/cli) (`npx shadcn@latest init` to set up if needed).

```sh
# Install both Dropdown and Command Palette
npx shadcn add https://muleyuck.github.io/cmdrop/registry.json

# Or install individually
npx shadcn add https://muleyuck.github.io/cmdrop/registry.json/dropdown
npx shadcn add https://muleyuck.github.io/cmdrop/registry.json/command
```

Files are copied to `components/ui/dropdown/` and `components/ui/command/`.

## Dropdown

```tsx
import { Content, Dropdown, Item, Trigger } from "@/components/ui/dropdown"

const [value, setValue] = useState<string>()

<Dropdown value={value} onValueChange={setValue}>
  <Trigger>Open</Trigger>
  <Content>
    <Item value="react">React</Item>
    <Item value="vue">Vue</Item>
    <Item value="svelte">Svelte</Item>
  </Content>
</Dropdown>
```

Supports multiple selection, groups, separators, and filterable search with highlighted matches. [See all examples →](https://muleyuck.github.io/cmdrop/)

### Dropdown API

| Component | Key props | Data attributes |
|-----------|-----------|-----------------|
| `Dropdown` | `value`, `onValueChange`, `multiple`, `open`, `onOpenChange`, `filterable` | — |
| `Trigger` | HTML `<button>` attributes | `data-state="open\|closed"` |
| `Content` | HTML `<div>` attributes | `data-side="top\|bottom"` |
| `Item` | `value`, `disabled`, `onSelect` | `data-highlighted`, `data-selected`, `data-disabled` |
| `Group` | `label`, `labelClassName` | — |
| `Input` | HTML `<input>` attributes | — |
| `Empty` | HTML `<div>` attributes | — |
| `Separator` | HTML `<hr>` attributes | — |
| `useHighlight` | `{ className }` | Returns `(text: string) => ReactNode` |

**Keyboard:** `↑`/`↓` to navigate, `Enter` to select, `Escape` to close. Pressing `↑`/`↓` on the `Trigger` opens the list and jumps to the last/first item.

## Command Palette

`Command` listens globally for `⌘K` / `Ctrl+K` to toggle open/closed.

```tsx
import { Command, Dialog, Empty, Group, Input, Item, List, Overlay, useHighlight } from "@/components/ui/command"

const [open, setOpen] = useState(false)

<Command open={open} onOpenChange={setOpen}>
  <Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
  <Dialog className="fixed left-1/2 top-[15vh] -translate-x-1/2 w-full max-w-lg rounded-xl bg-white shadow-2xl">
    <Input placeholder="Search commands…" />
    <List className="max-h-72 overflow-y-auto">
      <Item value="Home" onSelect={() => { window.scrollTo({ top: 0 }); setOpen(false) }}>Home</Item>
    </List>
    <Empty>No results found.</Empty>
  </Dialog>
</Command>
```

### Command API

| Component | Key props | Data attributes |
|-----------|-----------|-----------------|
| `Command` | `open`, `onOpenChange` | — |
| `Dialog` | `autoFocus` (default `true`), HTML `<div>` attributes | — |
| `Overlay` | HTML `<div>` attributes | — |
| `Input` | HTML `<input>` attributes | — |
| `List` | HTML `<div>` attributes | — |
| `Item` | `value`, `onSelect` (required), `disabled` | `data-highlighted`, `data-disabled` |
| `Group` | `label`, `labelClassName`, `forceMount` | — |
| `Empty` | HTML `<div>` attributes | — |
| `Separator` | HTML `<hr>` attributes | — |
| `useHighlight` | `{ className }` | Returns `(text: string) => ReactNode` |

`Item.value` defaults to the text content of `children` when omitted.

**Keyboard:** `↑`/`↓` to navigate, `Enter` to select, `Escape` to close, `⌘K`/`Ctrl+K` to toggle.


## License

[The MIT Licence](https://github.com/muleyuck/cmdrop/blob/main/LICENSE)

