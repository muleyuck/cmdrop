import { useEffect, useLayoutEffect, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useDropdown } from './context'

interface ContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

interface Position {
  top: number
  left: number
  width: number
  side: 'top' | 'bottom'
  ready: boolean
}

export function Content({ children, style, onKeyDown, ...rest }: ContentProps) {
  const { open, setOpen, triggerId, contentId, triggerRef, contentRef } = useDropdown()

  const [pos, setPos] = useState<Position>({ top: 0, left: 0, width: 0, side: 'bottom', ready: false })

  // 位置計算: 描画前に実行してフリッカーを防ぐ
  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !contentRef.current) {
      setPos((p) => ({ ...p, ready: false }))
      return
    }
    const trigger = triggerRef.current.getBoundingClientRect()
    const content = contentRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - trigger.bottom

    const side: 'top' | 'bottom' = spaceBelow >= content.height || spaceBelow >= trigger.top ? 'bottom' : 'top'
    const top = side === 'bottom' ? trigger.bottom : trigger.top - content.height

    setPos({ top, left: trigger.left, width: trigger.width, side, ready: true })
  }, [open])

  // 外側クリックで閉じる (pointerdown でマウス・タッチ統一)
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target) || contentRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, setOpen, triggerRef, contentRef])

  // Escape で閉じる: フォーカス位置に依らずドキュメントレベルで監視
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, setOpen, triggerRef])

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
  }

  if (!open) return null

  return createPortal(
    <div
      ref={contentRef}
      id={contentId}
      role="listbox"
      aria-labelledby={triggerId}
      tabIndex={-1}
      data-cmdrop-content=""
      data-state="open"
      data-side={pos.side}
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        minWidth: pos.width,
        visibility: pos.ready ? 'visible' : 'hidden',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>,
    document.body,
  )
}
