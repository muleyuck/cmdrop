import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Command } from "../../src/command/Command"
import { Input } from "../../src/command/Input"
import { Item } from "../../src/command/Item"
import { List } from "../../src/command/List"

function setup() {
  return render(
    <Command open>
      <Input />
      <List>
        <Item onSelect={vi.fn()}>Home</Item>
        <Item onSelect={vi.fn()}>Settings</Item>
      </List>
    </Command>,
  )
}

describe("Command filtering", () => {
  it("初期状態では全アイテムが表示される", () => {
    setup()
    expect(screen.getByRole("option", { name: "Home" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Settings" })).toBeInTheDocument()
  })

  it("クエリに一致するアイテムのみ表示される", async () => {
    setup()
    await userEvent.type(screen.getByRole("textbox"), "set")
    expect(screen.queryByRole("option", { name: "Home" })).not.toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Settings" })).toBeInTheDocument()
  })

  it("大文字小文字を区別しない", async () => {
    setup()
    await userEvent.type(screen.getByRole("textbox"), "HOME")
    expect(screen.getByRole("option", { name: "Home" })).toBeInTheDocument()
    expect(screen.queryByRole("option", { name: "Settings" })).not.toBeInTheDocument()
  })

  it("フィルタリングでハイライト中のアイテムが消えたとき Enter が残ったアイテムを選択できる", async () => {
    const onSettings = vi.fn()
    render(
      <Command open>
        <Input />
        <List>
          <Item onSelect={vi.fn()}>Home</Item>
          <Item onSelect={onSettings}>Settings</Item>
        </List>
      </Command>,
    )
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }))
    })
    expect(screen.getByRole("option", { name: "Home" })).toHaveAttribute("data-highlighted")

    await userEvent.type(screen.getByRole("textbox"), "set")
    expect(screen.queryByRole("option", { name: "Home" })).not.toBeInTheDocument()

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }))
    })
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }))
    })
    expect(onSettings).toHaveBeenCalledTimes(1)
  })
})
