import { act, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Command } from "../../src/command/Command"
import { Input } from "../../src/command/Input"
import { Item } from "../../src/command/Item"
import { List } from "../../src/command/List"

function setup() {
  const onHome = vi.fn()
  const onSettings = vi.fn()
  const onOpenChange = vi.fn()
  render(
    <Command open onOpenChange={onOpenChange}>
      <Input />
      <List>
        <Item onSelect={onHome}>Home</Item>
        <Item onSelect={onSettings}>Settings</Item>
      </List>
    </Command>,
  )
  return { onHome, onSettings, onOpenChange }
}

function pressKey(key: string, init?: KeyboardEventInit) {
  act(() => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, ...init }))
  })
}

describe("Command keyboard navigation", () => {
  it("ArrowDown で最初のアイテムがハイライトされる", () => {
    setup()
    pressKey("ArrowDown")
    expect(screen.getByRole("option", { name: "Home" })).toHaveAttribute("data-highlighted")
    expect(screen.getByRole("option", { name: "Settings" })).not.toHaveAttribute("data-highlighted")
  })

  it("ArrowDown を2回押すと次のアイテムに移る", () => {
    setup()
    pressKey("ArrowDown")
    pressKey("ArrowDown")
    expect(screen.getByRole("option", { name: "Home" })).not.toHaveAttribute("data-highlighted")
    expect(screen.getByRole("option", { name: "Settings" })).toHaveAttribute("data-highlighted")
  })

  it("ArrowDown が末尾でループして先頭に戻る", () => {
    setup()
    pressKey("ArrowDown") // Home
    pressKey("ArrowDown") // Settings
    pressKey("ArrowDown") // Home (ループ)
    expect(screen.getByRole("option", { name: "Home" })).toHaveAttribute("data-highlighted")
    expect(screen.getByRole("option", { name: "Settings" })).not.toHaveAttribute("data-highlighted")
  })

  it("ArrowUp で前のアイテムに戻る", () => {
    setup()
    pressKey("ArrowDown") // Home
    pressKey("ArrowDown") // Settings
    pressKey("ArrowUp") // Home
    expect(screen.getByRole("option", { name: "Home" })).toHaveAttribute("data-highlighted")
    expect(screen.getByRole("option", { name: "Settings" })).not.toHaveAttribute("data-highlighted")
  })

  it("ArrowUp が先頭でループして末尾に戻る", () => {
    setup()
    pressKey("ArrowDown") // Home
    pressKey("ArrowUp") // Settings (ループ)
    expect(screen.getByRole("option", { name: "Home" })).not.toHaveAttribute("data-highlighted")
    expect(screen.getByRole("option", { name: "Settings" })).toHaveAttribute("data-highlighted")
  })

  it("ハイライトされたアイテムで Enter を押すと onSelect が呼ばれる", () => {
    const { onHome } = setup()
    pressKey("ArrowDown") // Home
    pressKey("Enter")
    expect(onHome).toHaveBeenCalledTimes(1)
  })

  it("ハイライトなしで Enter を押しても何も起きない", () => {
    const { onHome, onSettings } = setup()
    pressKey("Enter")
    expect(onHome).not.toHaveBeenCalled()
    expect(onSettings).not.toHaveBeenCalled()
  })

  it("Escape 後に再度開くとハイライトがリセットされる", () => {
    const { onOpenChange } = setup()
    pressKey("ArrowDown") // Home
    pressKey("ArrowDown") // Settings
    pressKey("Escape")
    expect(onOpenChange).toHaveBeenCalledWith(false)

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))
    })
    pressKey("ArrowDown") // 再度 open → Home (先頭から)
    expect(screen.getByRole("option", { name: "Home" })).toHaveAttribute("data-highlighted")
    expect(screen.getByRole("option", { name: "Settings" })).not.toHaveAttribute("data-highlighted")
  })
})
