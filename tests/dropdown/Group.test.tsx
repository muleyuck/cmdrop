import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Content } from "../../src/dropdown/Content"
import { Dropdown } from "../../src/dropdown/Dropdown"
import { Empty } from "../../src/dropdown/Empty"
import { Group } from "../../src/dropdown/Group"
import { Item } from "../../src/dropdown/Item"
import { Trigger } from "../../src/dropdown/Trigger"
import { Separator } from "../../src/shared/Separator"

describe("Dropdown.Group", () => {
  it("role=group としてレンダリングされる", async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>
          <Group label="Fruits">
            <Item value="apple">Apple</Item>
          </Group>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    expect(screen.getByRole("group")).toBeInTheDocument()
  })

  it("label があれば aria-labelledby でラベルを参照する", async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>
          <Group label="Fruits">
            <Item value="apple">Apple</Item>
          </Group>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    const group = screen.getByRole("group")
    const label = screen.getByText("Fruits")
    expect(group).toHaveAttribute("aria-labelledby", label.id)
  })

  it("labelClassName がラベル要素に適用される", async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>
          <Group label="Fruits" labelClassName="text-xs font-bold">
            <Item value="apple">Apple</Item>
          </Group>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    expect(screen.getByText("Fruits")).toHaveClass("text-xs", "font-bold")
  })

  it("label がなければ aria-labelledby を持たない", async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>
          <Group>
            <Item value="apple">Apple</Item>
          </Group>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    expect(screen.getByRole("group")).not.toHaveAttribute("aria-labelledby")
  })
})

describe("Dropdown.Separator", () => {
  it("role=separator としてレンダリングされる", async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>
          <Item value="a">A</Item>
          <Separator />
          <Item value="b">B</Item>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    expect(screen.getByRole("separator")).toBeInTheDocument()
  })
})

describe("Dropdown.Empty", () => {
  it("aria-live=polite を持つ", async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>
          <Empty>No results</Empty>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    const empty = screen.getByText("No results")
    expect(empty).toHaveAttribute("aria-live", "polite")
  })
})
