import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Content } from "../../src/dropdown/Content"
import { Dropdown } from "../../src/dropdown/Dropdown"
import { Trigger } from "../../src/dropdown/Trigger"

describe("Dropdown.Content", () => {
  it("closed 時はレンダリングされない", () => {
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>content</Content>
      </Dropdown>,
    )
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
  })

  it("open 時に listbox がレンダリングされる", async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>content</Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    expect(screen.getByRole("listbox")).toBeInTheDocument()
    expect(screen.getByRole("listbox")).toHaveAttribute("data-cmdrop-content")
    expect(screen.getByRole("listbox")).toHaveAttribute("data-state", "open")
  })

  it("Trigger と listbox が aria で紐付いている", async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>content</Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    const trigger = screen.getByRole("button")
    const listbox = screen.getByRole("listbox")
    expect(trigger).toHaveAttribute("aria-controls", listbox.id)
    expect(listbox).toHaveAttribute("aria-labelledby", trigger.id)
  })

  it("Escape で閉じる", async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>content</Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    expect(screen.getByRole("listbox")).toBeInTheDocument()
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
  })

  it("Content 外クリックで閉じる", async () => {
    const user = userEvent.setup()
    render(
      <div>
        <Dropdown>
          <Trigger>Open</Trigger>
          <Content>content</Content>
        </Dropdown>
        <button type="button">outside</button>
      </div>,
    )
    await user.click(screen.getByRole("button", { name: "Open" }))
    expect(screen.getByRole("listbox")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "outside" }))
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
  })

  it("スクロール時に閉じる", async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>content</Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    expect(screen.getByRole("listbox")).toBeInTheDocument()

    act(() => {
      document.dispatchEvent(new Event("scroll"))
    })

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
  })

  it("Content 内クリックでは閉じない", async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>
          <span>inside</span>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole("button"))
    await user.click(screen.getByText("inside"))
    expect(screen.getByRole("listbox")).toBeInTheDocument()
  })
})
