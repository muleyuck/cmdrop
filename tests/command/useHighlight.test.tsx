import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Command } from "../../src/command/Command"
import { Input } from "../../src/command/Input"
import { useHighlight } from "../../src/command/useHighlight"

function HighlightTest({ text, className = "hl" }: { text: string; className?: string }) {
  const highlight = useHighlight({ className })
  return <div data-testid="result">{highlight(text)}</div>
}

function setup(text = "Calendar") {
  return render(
    <Command open>
      <Input />
      <HighlightTest text={text} />
    </Command>,
  )
}

describe("useHighlight", () => {
  it("クエリが空のときはテキストをそのまま返す", () => {
    setup()
    expect(screen.getByTestId("result")).toHaveTextContent("Calendar")
    expect(screen.getByTestId("result").querySelector(".hl")).toBeNull()
  })

  it("クエリに一致する部分をハイライト span でラップする", async () => {
    setup()
    await userEvent.type(screen.getByRole("textbox"), "cal")
    const hl = screen.getByTestId("result").querySelector(".hl")
    expect(hl).toBeInTheDocument()
    expect(hl).toHaveTextContent("Cal")
  })

  it("大文字小文字を区別しない", async () => {
    setup()
    await userEvent.type(screen.getByRole("textbox"), "CAL")
    const hl = screen.getByTestId("result").querySelector(".hl")
    expect(hl).toBeInTheDocument()
    expect(hl).toHaveTextContent("Cal")
  })

  it("マッチしない場合はハイライトなし", async () => {
    setup()
    await userEvent.type(screen.getByRole("textbox"), "xyz")
    expect(screen.getByTestId("result").querySelector(".hl")).toBeNull()
    expect(screen.getByTestId("result")).toHaveTextContent("Calendar")
  })

  it("前後の非マッチ部分も保持する", async () => {
    setup("Settings")
    await userEvent.type(screen.getByRole("textbox"), "tti")
    const result = screen.getByTestId("result")
    expect(result).toHaveTextContent("Settings")
    expect(result.querySelector(".hl")).toHaveTextContent("tti")
  })

  it("className オプションがハイライト span に適用される", async () => {
    render(
      <Command open>
        <Input />
        <HighlightTest text="Calendar" className="font-bold text-indigo-400" />
      </Command>,
    )
    await userEvent.type(screen.getByRole("textbox"), "cal")
    expect(screen.getByTestId("result").querySelector(".text-indigo-400")).toHaveClass("text-indigo-400", "font-bold")
  })
})
