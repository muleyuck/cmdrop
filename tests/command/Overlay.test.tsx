import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Command } from "../../src/command/Command"
import { Dialog } from "../../src/command/Dialog"
import { Input } from "../../src/command/Input"
import { Overlay } from "../../src/command/Overlay"

function setup(open = false, onOpenChange = () => {}) {
  return render(
    <Command open={open} onOpenChange={onOpenChange}>
      <Overlay />
      <Dialog>
        <Input />
      </Dialog>
    </Command>,
  )
}

describe("Overlay", () => {
  it("open のとき overlay がレンダリングされる", () => {
    setup(true)
    expect(screen.getByRole("presentation")).toBeInTheDocument()
  })

  it("open=false のとき overlay はレンダリングされない", () => {
    setup(false)
    expect(screen.queryByRole("presentation")).not.toBeInTheDocument()
  })

  it("className が overlay 要素に適用される", () => {
    render(
      <Command open>
        <Overlay className="bg-black/60 backdrop-blur" />
      </Command>,
    )
    expect(screen.getByRole("presentation")).toHaveClass("bg-black/60", "backdrop-blur")
  })

  it("overlay をクリックするとダイアログが閉じる", async () => {
    const onOpenChange = vi.fn()
    setup(true, onOpenChange)
    await userEvent.click(screen.getByRole("presentation"))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("Dialog 内をクリックしても閉じない", async () => {
    const onOpenChange = vi.fn()
    setup(true, onOpenChange)
    await userEvent.click(screen.getByRole("dialog"))
    expect(onOpenChange).not.toHaveBeenCalled()
  })
})
