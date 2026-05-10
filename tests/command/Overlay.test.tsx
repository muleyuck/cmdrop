import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Command } from "../../src/command/Command"
import { Dialog } from "../../src/command/Dialog"
import { Input } from "../../src/command/Input"
import { Overlay } from "../../src/command/Overlay"

function setup(open?: boolean, onOpenChange?: (open: boolean) => void) {
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
    expect(document.querySelector("[data-cmdrop-command-overlay]")).toBeInTheDocument()
  })

  it("open=false のとき overlay はレンダリングされない", () => {
    setup(false)
    expect(document.querySelector("[data-cmdrop-command-overlay]")).not.toBeInTheDocument()
  })

  it("className が overlay 要素に適用される", () => {
    render(
      <Command open>
        <Overlay className="bg-black/60 backdrop-blur" />
      </Command>,
    )
    expect(document.querySelector("[data-cmdrop-command-overlay]")).toHaveClass("bg-black/60", "backdrop-blur")
  })

  it("overlay をクリックするとダイアログが閉じる", async () => {
    const onOpenChange = vi.fn()
    setup(true, onOpenChange)
    await userEvent.click(document.querySelector("[data-cmdrop-command-overlay]") as Element)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("Dialog 内をクリックしても閉じない", async () => {
    const onOpenChange = vi.fn()
    setup(true, onOpenChange)
    await userEvent.click(screen.getByRole("dialog"))
    expect(onOpenChange).not.toHaveBeenCalled()
  })
})
