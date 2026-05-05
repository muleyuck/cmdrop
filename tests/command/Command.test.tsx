import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Command } from "../../src/command/Command"
import { Dialog } from "../../src/command/Dialog"
import { Input } from "../../src/command/Input"
import { Item } from "../../src/command/Item"
import { List } from "../../src/command/List"

function setup(open?: boolean) {
  return render(
    <Command open={open}>
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
