import { type ReactNode, useState } from "react"
import { ShikiHighlighter } from "react-shiki"

export interface DemoVariant {
  name: string
  preview: ReactNode
  code: string
}

function normalizeSource(source: string): string {
  return source.replace(/from "\.\.\.?\/\.\.\.?\/\.\.?\/src\/(.*?)"/g, 'from "@/components/ui/$1"')
}

export function DemoCard({
  label,
  description,
  variants,
}: {
  label: string
  description: string
  variants: DemoVariant[]
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview")
  const [variantIndex, setVariantIndex] = useState(0)

  const tabCls = (active: boolean) =>
    [
      "px-3 py-2 text-xs font-medium transition-colors",
      active
        ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
        : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400",
    ].join(" ")

  const variantTabCls = (active: boolean) =>
    [
      "px-3 py-1.5 text-xs font-medium transition-colors rounded-md",
      active
        ? "bg-zinc-200/70 text-zinc-800 dark:bg-zinc-700/60 dark:text-zinc-200"
        : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300",
    ].join(" ")

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-100/40 dark:border-zinc-800/60 dark:bg-zinc-900/40">
      <div className="px-6 pt-6 pb-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">{label}</p>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
      <div className="border-t border-zinc-200/60 dark:border-zinc-800/60">
        {variants.length > 1 && (
          <div className="flex gap-1 border-b border-zinc-200/60 px-4 py-2 dark:border-zinc-800/60">
            {variants.map((v, i) => (
              <button
                key={v.name}
                type="button"
                onClick={() => setVariantIndex(i)}
                className={variantTabCls(variantIndex === i)}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}
        <div className="flex border-b border-zinc-200/60 px-4 dark:border-zinc-800/60">
          <button type="button" onClick={() => setTab("preview")} className={tabCls(tab === "preview")}>
            Preview
          </button>
          <button type="button" onClick={() => setTab("code")} className={tabCls(tab === "code")}>
            Code
          </button>
        </div>
        {tab === "preview" ? (
          <div className="p-6">{variants[variantIndex].preview}</div>
        ) : (
          <div className="w-0 min-w-full max-h-96 overflow-auto bg-zinc-950 dark:bg-zinc-900/80">
            <ShikiHighlighter
              language="tsx"
              theme="github-dark"
              showLineNumbers={true}
              showLanguage={true}
              className="text-xs [&>pre]:bg-transparent! [&>pre]:p-4 [&>pre]:leading-relaxed"
            >
              {normalizeSource(variants[variantIndex].code)}
            </ShikiHighlighter>
          </div>
        )}
      </div>
    </div>
  )
}
