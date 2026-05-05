import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Item } from "../../src/command/Item"

describe("Item", () => {
  it("Enter キーで onSelect が呼ばれる", async () => {
    const onSelect = vi.fn()
    render(<Item onSelect={onSelect}>Home</Item>)
    screen.getByRole("option").focus()
    await userEvent.keyboard("{Enter}")
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it("disabled のとき Enter キーで onSelect が呼ばれない", async () => {
    const onSelect = vi.fn()
    render(
      <Item onSelect={onSelect} disabled>
        Home
      </Item>,
    )
    screen.getByRole("option").focus()
    await userEvent.keyboard("{Enter}")
    expect(onSelect).not.toHaveBeenCalled()
  })
})
