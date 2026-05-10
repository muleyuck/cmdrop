import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Separator } from "../../src/command/Separator"

describe("Separator", () => {
  it("hr としてレンダリングされる", () => {
    const { container } = render(<Separator />)
    const hr = container.querySelector("hr")
    expect(hr).toBeInTheDocument()
  })
})
