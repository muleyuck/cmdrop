import { act, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Command } from "../../src/command/Command"
import { Dialog } from "../../src/command/Dialog"
import { Input } from "../../src/command/Input"
import { Item } from "../../src/command/Item"
import { List } from "../../src/command/List"

function setup(open?: boolean, onOpenChange?: (open: boolean) => void) {
  return render(
    <Command open={open} onOpenChange={onOpenChange}>
      <Dialog>
        <Input />
        <List>
          <Item onSelect={vi.fn()}>Home</Item>
        </List>
      </Dialog>
    </Command>,
  )
}

describe("Command + Dialog", () => {
  it("初期状態で closed", () => {
    setup()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("open=true でダイアログがレンダリングされる", () => {
    setup(true)
    const dialog = screen.getByRole("dialog")
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute("data-cmdrop-command-dialog")
    expect(dialog).toHaveAttribute("aria-modal", "true")
  })
})

describe("Command keyboard shortcuts", () => {
  it("Escape キーでダイアログが閉じる", () => {
    const onOpenChange = vi.fn()
    setup(true, onOpenChange)
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))
    })

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("Meta+K でダイアログが開く", () => {
    const onOpenChange = vi.fn()
    setup(false, onOpenChange)

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))
    })

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("Ctrl+K でダイアログが開く", () => {
    const onOpenChange = vi.fn()
    setup(false, onOpenChange)

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }))
    })

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })
})
