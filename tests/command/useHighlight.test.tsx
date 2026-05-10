import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Command } from "../../src/command/Command"
import { Input } from "../../src/command/Input"
import { useHighlight } from "../../src/command/useHighlight"

function HighlightTest({ text, className }: { text: string; className?: string }) {
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
    expect(screen.getByTestId("result").querySelector("[data-cmdrop-command-highlight]")).toBeNull()
  })

  it("クエリに一致する部分を data-cmdrop-command-highlight でラップする", async () => {
    setup()
    await userEvent.type(screen.getByRole("textbox"), "cal")
    const span = screen.getByTestId("result").querySelector("[data-cmdrop-command-highlight]")
    expect(span).toBeInTheDocument()
    expect(span).toHaveTextContent("Cal")
  })

  it("大文字小文字を区別しない", async () => {
    setup()
    await userEvent.type(screen.getByRole("textbox"), "CAL")
    const span = screen.getByTestId("result").querySelector("[data-cmdrop-command-highlight]")
    expect(span).toBeInTheDocument()
    expect(span).toHaveTextContent("Cal")
  })

  it("マッチしない場合はハイライトなし", async () => {
    setup()
    await userEvent.type(screen.getByRole("textbox"), "xyz")
    expect(screen.getByTestId("result").querySelector("[data-cmdrop-command-highlight]")).toBeNull()
    expect(screen.getByTestId("result")).toHaveTextContent("Calendar")
  })

  it("前後の非マッチ部分も保持する", async () => {
    setup("Settings")
    await userEvent.type(screen.getByRole("textbox"), "tti")
    const result = screen.getByTestId("result")
    expect(result).toHaveTextContent("Settings")
    const span = result.querySelector("[data-cmdrop-command-highlight]")
    expect(span).toHaveTextContent("tti")
  })

  it("className オプションがハイライト span に適用される", async () => {
    render(
      <Command open>
        <Input />
        <HighlightTest text="Calendar" className="text-indigo-400 font-bold" />
      </Command>,
    )
    await userEvent.type(screen.getByRole("textbox"), "cal")
    const span = screen.getByTestId("result").querySelector("[data-cmdrop-command-highlight]")
    expect(span).toHaveClass("text-indigo-400", "font-bold")
  })
})
