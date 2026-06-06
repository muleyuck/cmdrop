import { useEffect, useState } from "react"
import { Content, Dropdown, Item, Separator, Trigger } from "../../src/dropdown"
import { DemoCard } from "./DemoCard"
import CommandDialogExample from "./examples/CommandDialogExample"
import commandDialogSource from "./examples/CommandDialogExample.tsx?raw"
import DropdownFilterableExample from "./examples/DropdownFilterableExample"
import dropdownFilterableSource from "./examples/DropdownFilterableExample.tsx?raw"
import DropdownGroupsExample from "./examples/DropdownGroupsExample"
import dropdownGroupsSource from "./examples/DropdownGroupsExample.tsx?raw"
import DropdownMultipleExample from "./examples/DropdownMultipleExample"
import dropdownMultipleSource from "./examples/DropdownMultipleExample.tsx?raw"
import DropdownSingleExample from "./examples/DropdownSingleExample"
import dropdownSingleSource from "./examples/DropdownSingleExample.tsx?raw"
import { CheckIcon, ChevronIcon, CopyIcon, MoonIcon, SunIcon } from "./Icons"

const INSTALL_CMD = "npx shadcn add https://muleyuck.github.io/cmdrop/registry.json"

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export const App = () => {
  const [copied, setCopied] = useState(false)
  const [isDark, setIsDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  const copyInstall = async () => {
    await navigator.clipboard.writeText(INSTALL_CMD)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
      <header className="sticky top-0 z-40 border-zinc-200/60 border-b bg-zinc-50/80 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <img
            src={`${import.meta.env.BASE_URL}${isDark ? "logo-dark.svg" : "logo-light.svg"}`}
            alt="cmdrop"
            className="h-10 w-auto"
          />

          <nav className="flex items-center gap-1">
            <Dropdown>
              <Trigger className="inline-flex h-8 items-center gap-1 rounded-md px-3 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 data-[state=open]:bg-zinc-100 data-[state=open]:text-zinc-900 dark:text-zinc-400 dark:data-[state=open]:bg-zinc-800 dark:data-[state=open]:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                <span>Components</span>
                <ChevronIcon />
              </Trigger>
              <Content className="z-50 overflow-hidden rounded-lg border border-zinc-200 bg-white p-1 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
                <Item
                  value="dropdown"
                  className="flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-zinc-700 outline-none data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900 dark:text-zinc-300 dark:data-highlighted:bg-zinc-700/60 dark:data-highlighted:text-zinc-100"
                  onSelect={() => scrollTo("dropdown")}
                >
                  <span className="text-zinc-400 dark:text-zinc-500">↓</span>
                  <span>Dropdown</span>
                </Item>
                <Item
                  value="command"
                  className="flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-zinc-700 outline-none data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900 dark:text-zinc-300 dark:data-highlighted:bg-zinc-700/60 dark:data-highlighted:text-zinc-100"
                  onSelect={() => scrollTo("command")}
                >
                  <span className="text-zinc-400 dark:text-zinc-500">⌘</span>
                  <span>Command Palette</span>
                </Item>
                <Separator className="my-1 border-zinc-200/50 border-t dark:border-zinc-700/50" />
                <Item
                  value="registry"
                  className="flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-zinc-700 outline-none data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900 dark:text-zinc-300 dark:data-highlighted:bg-zinc-700/60 dark:data-highlighted:text-zinc-100"
                  onSelect={() => window.open("https://muleyuck.github.io/cmdrop/registry.json", "_blank")}
                >
                  <span className="text-zinc-400 dark:text-zinc-500">⊞</span>
                  <span>Registry</span>
                </Item>
              </Content>
            </Dropdown>

            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              className="inline-flex aspect-square h-8 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            <a
              href="https://github.com/muleyuck/cmdrop"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center rounded-md px-4 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center pt-24 text-center">
          <h1 className="mb-8 font-bold text-7xl tracking-tight sm:text-8xl">
            <span className="bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400">
              cmdrop
            </span>
          </h1>

          <p className="mb-10 max-w-md text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
            Dropdown and Command Palette for React. Copy into your project via shadcn/ui and style it your way.
          </p>

          <div className="mb-16 flex items-center gap-2 rounded-lg border border-zinc-200/60 bg-zinc-100/60 px-3 py-2 font-mono text-sm text-zinc-600 dark:border-zinc-700/60 dark:bg-zinc-900/60 dark:text-zinc-400">
            <span className="select-all">{INSTALL_CMD}</span>
            <button
              type="button"
              onClick={copyInstall}
              className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="mb-6 text-center font-semibold text-sm text-zinc-400 uppercase tracking-wide dark:text-zinc-500">
            Components
          </h2>
          <div className="grid gap-8">
            <section id="dropdown" className="scroll-mt-20">
              <DemoCard
                label="Dropdown"
                description="Single and multiple selection with full keyboard navigation."
                variants={[
                  { name: "Single", preview: <DropdownSingleExample />, code: dropdownSingleSource },
                  { name: "Multiple", preview: <DropdownMultipleExample />, code: dropdownMultipleSource },
                  { name: "Groups", preview: <DropdownGroupsExample />, code: dropdownGroupsSource },
                  { name: "Filterable", preview: <DropdownFilterableExample />, code: dropdownFilterableSource },
                ]}
              />
            </section>
            <section id="command" className="scroll-mt-20">
              <DemoCard
                label="Command"
                description="Filterable command palette with keyboard navigation and search highlighting."
                variants={[{ name: "Dialog", preview: <CommandDialogExample />, code: commandDialogSource }]}
              />
            </section>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pb-24 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">Ready to use it?</p>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200/60 bg-zinc-100/60 px-3 py-2 font-mono text-sm text-zinc-600 dark:border-zinc-700/60 dark:bg-zinc-900/60 dark:text-zinc-400">
            <span className="select-all">{INSTALL_CMD}</span>
            <button
              type="button"
              onClick={copyInstall}
              className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          <a
            href="https://github.com/muleyuck/cmdrop"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          >
            View on GitHub →
          </a>
        </div>
      </main>
    </div>
  )
}
