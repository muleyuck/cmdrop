import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Content } from "../../src/dropdown/Content"
import { Dropdown } from "../../src/dropdown/Dropdown"
import { Empty } from "../../src/dropdown/Empty"
import { Input } from "../../src/dropdown/Input"
import { Item } from "../../src/dropdown/Item"
import { Trigger } from "../../src/dropdown/Trigger"

function setup() {
  return render(
    <Dropdown filterable>
      <Trigger>Open</Trigger>
      <Content>
        <Input placeholder="Search..." />
        <Item value="apple" onSelect={vi.fn()}>
          Apple
        </Item>
        <Item value="banana" onSelect={vi.fn()}>
          Banana
        </Item>
        <Item value="cherry" onSelect={vi.fn()}>
          Cherry
        </Item>
        <Empty>No results</Empty>
      </Content>
    </Dropdown>,
  )
}

describe("Dropdown filtering", () => {
  it("初期状態では全アイテムが表示される", async () => {
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByRole("button"))
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Cherry" })).toBeInTheDocument()
  })

  it("クエリに一致するアイテムのみ表示される", async () => {
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByRole("button"))
    await user.type(screen.getByRole("searchbox"), "ban")
    expect(screen.queryByRole("option", { name: "Apple" })).not.toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument()
    expect(screen.queryByRole("option", { name: "Cherry" })).not.toBeInTheDocument()
  })

  it("大文字小文字を区別しない", async () => {
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByRole("button"))
    await user.type(screen.getByRole("searchbox"), "APPLE")
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument()
    expect(screen.queryByRole("option", { name: "Banana" })).not.toBeInTheDocument()
  })

  it("一致するアイテムがない場合 Empty が表示される", async () => {
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByRole("button"))
    await user.type(screen.getByRole("searchbox"), "xyz")
    expect(screen.queryByRole("option")).not.toBeInTheDocument()
    expect(screen.getByText("No results")).toBeInTheDocument()
  })

  it("クエリ入力時に先頭の一致アイテムが auto-highlight される", async () => {
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByRole("button"))
    await user.type(screen.getByRole("searchbox"), "an")
    expect(screen.getByRole("option", { name: "Banana" })).toHaveAttribute("data-highlighted")
  })

  it("auto-highlight 状態で Enter を押すと onSelect が呼ばれる", async () => {
    const user = userEvent.setup()
    const onBanana = vi.fn()
    render(
      <Dropdown filterable>
        <Trigger>Open</Trigger>
        <Content>
          <Input placeholder="Search..." />
          <Item value="apple" onSelect={vi.fn()}>
            Apple
          </Item>
          <Item value="banana" onSelect={onBanana}>
            Banana
          </Item>
          <Empty>No results</Empty>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    await user.type(screen.getByRole("searchbox"), "ban")
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }))
    })
    expect(onBanana).toHaveBeenCalledTimes(1)
  })

  it("filterable でない場合は Input があってもフィルタリングされない", async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>
          <Input placeholder="Search..." />
          <Item value="apple" onSelect={vi.fn()}>
            Apple
          </Item>
          <Item value="banana" onSelect={vi.fn()}>
            Banana
          </Item>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    await user.type(screen.getByRole("searchbox"), "ban")
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument()
  })

  it("閉じて再度開くとクエリがクリアされる", async () => {
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByRole("button"))
    await user.type(screen.getByRole("searchbox"), "ban")
    expect(screen.queryByRole("option", { name: "Apple" })).not.toBeInTheDocument()

    await user.click(screen.getByRole("button"))
    await user.click(screen.getByRole("button"))
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument()
  })
})
