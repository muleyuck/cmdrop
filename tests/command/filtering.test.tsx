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

  it("value prop を指定すると JSX children でもフィルタリングされる", async () => {
    render(
      <Command open>
        <Input />
        <List>
          <Item value="Home" onSelect={vi.fn()}>
            <span>⌂</span> Home
          </Item>
          <Item value="Settings" onSelect={vi.fn()}>
            <span>⚙</span> Settings
          </Item>
        </List>
      </Command>,
    )
    await userEvent.type(screen.getByRole("textbox"), "set")
    expect(screen.queryByRole("option", { name: /Home/ })).not.toBeInTheDocument()
    expect(screen.getByRole("option", { name: /Settings/ })).toBeInTheDocument()
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

  it("クエリクリア後の ArrowDown ナビゲーションが元の順序になる", async () => {
    setup()
    await userEvent.type(screen.getByRole("textbox"), "set")
    await userEvent.clear(screen.getByRole("textbox"))

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }))
    })

    expect(screen.getByRole("option", { name: "Home" })).toHaveAttribute("data-highlighted")
    expect(screen.getByRole("option", { name: "Settings" })).not.toHaveAttribute("data-highlighted")
  })

  it("クエリを入力すると先頭の一致アイテムが自動ハイライトされる", async () => {
    setup()
    await userEvent.type(screen.getByRole("textbox"), "set")
    expect(screen.getByRole("option", { name: "Settings" })).toHaveAttribute("data-highlighted")
  })

  it("自動ハイライト状態で Enter を押すと onSelect が呼ばれる", async () => {
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
    await userEvent.type(screen.getByRole("textbox"), "set")
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }))
    })
    expect(onSettings).toHaveBeenCalledTimes(1)
  })

  it("クエリをクリアするとハイライトがリセットされる", async () => {
    setup()
    await userEvent.type(screen.getByRole("textbox"), "set")
    expect(screen.getByRole("option", { name: "Settings" })).toHaveAttribute("data-highlighted")
    await userEvent.clear(screen.getByRole("textbox"))
    expect(screen.getByRole("option", { name: "Home" })).not.toHaveAttribute("data-highlighted")
    expect(screen.getByRole("option", { name: "Settings" })).not.toHaveAttribute("data-highlighted")
  })

  it("onSelect 後に open=false にするとクエリがクリアされる", async () => {
    const onSettings = vi.fn()
    const { rerender } = render(
      <Command open>
        <Input />
        <List>
          <Item onSelect={vi.fn()}>Home</Item>
          <Item onSelect={onSettings}>Settings</Item>
        </List>
      </Command>,
    )
    await userEvent.type(screen.getByRole("textbox"), "set")
    expect(screen.queryByRole("option", { name: "Home" })).not.toBeInTheDocument()

    rerender(
      <Command open={false}>
        <Input />
        <List>
          <Item onSelect={vi.fn()}>Home</Item>
          <Item onSelect={onSettings}>Settings</Item>
        </List>
      </Command>,
    )
    rerender(
      <Command open>
        <Input />
        <List>
          <Item onSelect={vi.fn()}>Home</Item>
          <Item onSelect={onSettings}>Settings</Item>
        </List>
      </Command>,
    )
    expect(screen.getByRole("option", { name: "Home" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Settings" })).toBeInTheDocument()
  })

  it("閉じて再度開くとクエリがクリアされる", async () => {
    const onOpenChange = vi.fn()
    render(
      <Command open onOpenChange={onOpenChange}>
        <Input />
        <List>
          <Item onSelect={vi.fn()}>Home</Item>
          <Item onSelect={vi.fn()}>Settings</Item>
        </List>
      </Command>,
    )
    await userEvent.type(screen.getByRole("textbox"), "set")
    expect(screen.queryByRole("option", { name: "Home" })).not.toBeInTheDocument()

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))
    })

    render(
      <Command open>
        <Input />
        <List>
          <Item onSelect={vi.fn()}>Home</Item>
          <Item onSelect={vi.fn()}>Settings</Item>
        </List>
      </Command>,
    )
    expect(screen.getAllByRole("option", { name: "Home" })[0]).toBeInTheDocument()
    expect(screen.getAllByRole("option", { name: "Settings" })[0]).toBeInTheDocument()
  })
})
