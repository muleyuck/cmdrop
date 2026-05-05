import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Dropdown } from "../../src/dropdown/Dropdown"
import { Trigger } from "../../src/dropdown/Trigger"

describe("Dropdown + Trigger", () => {
  it("初期状態で closed", () => {
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
      </Dropdown>,
    )
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false")
    expect(screen.getByRole("button")).toHaveAttribute("data-state", "closed")
  })

  it("Trigger クリックで open になる", async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("button")).toHaveAttribute("data-state", "open")
  })

  it("onOpenChange を呼ぶ", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Dropdown onOpenChange={onOpenChange}>
        <Trigger>Open</Trigger>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("controlled open が外から制御できる", () => {
    render(
      <Dropdown open={true}>
        <Trigger>Open</Trigger>
      </Dropdown>,
    )
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true")
  })
})
