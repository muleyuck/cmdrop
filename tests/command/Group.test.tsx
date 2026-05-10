import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Command } from "../../src/command/Command"
import { Group } from "../../src/command/Group"
import { Item } from "../../src/command/Item"

describe("Group", () => {
  it("role=group でレンダリングされる", () => {
    render(
      <Command open>
        <Group>
          <Item onSelect={vi.fn()}>Home</Item>
        </Group>
      </Command>,
    )
    expect(screen.getByRole("group")).toBeInTheDocument()
    expect(screen.getByRole("group")).toHaveAttribute("data-cmdrop-command-group")
  })

  it("label を指定するとラベルが表示される", () => {
    render(
      <Command open>
        <Group label="Navigation">
          <Item onSelect={vi.fn()}>Home</Item>
        </Group>
      </Command>,
    )
    expect(screen.getByText("Navigation")).toBeInTheDocument()
  })

  it("label を指定すると aria-labelledby が設定される", () => {
    render(
      <Command open>
        <Group label="Navigation">
          <Item onSelect={vi.fn()}>Home</Item>
        </Group>
      </Command>,
    )
    const group = screen.getByRole("group")
    expect(group).toHaveAttribute("aria-labelledby")
  })

  it("labelClassName がラベル要素に適用される", () => {
    render(
      <Command open>
        <Group label="Navigation" labelClassName="text-xs font-bold">
          <Item onSelect={vi.fn()}>Home</Item>
        </Group>
      </Command>,
    )
    expect(screen.getByText("Navigation")).toHaveClass("text-xs", "font-bold")
  })
})
