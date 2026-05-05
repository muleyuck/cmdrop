import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Command } from "../../src/command/Command"
import { Empty } from "../../src/command/Empty"
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
      <Empty>No results</Empty>
    </Command>,
  )
}

describe("Empty", () => {
  it("初期状態では表示されない", () => {
    setup()
    expect(screen.queryByText("No results")).not.toBeInTheDocument()
  })

  it("クエリに一致するアイテムがないとき表示される", async () => {
    setup()
    await userEvent.type(screen.getByRole("textbox"), "zzz")
    expect(screen.getByText("No results")).toBeInTheDocument()
  })

  it("クエリに一致するアイテムがあるとき表示されない", async () => {
    setup()
    await userEvent.type(screen.getByRole("textbox"), "home")
    expect(screen.queryByText("No results")).not.toBeInTheDocument()
  })
})
