import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from '../../src/dropdown/Dropdown'
import { Trigger } from '../../src/dropdown/Trigger'
import { Content } from '../../src/dropdown/Content'
import { Item } from '../../src/dropdown/Item'

function setup(onValueChange = vi.fn()) {
  render(
    <Dropdown onValueChange={onValueChange}>
      <Trigger>Open</Trigger>
      <Content>
        <Item value="apple">Apple</Item>
        <Item value="banana">Banana</Item>
        <Item value="cherry" disabled>Cherry</Item>
        <Item value="lemon">Lemon</Item>
      </Content>
    </Dropdown>,
  )
  return { onValueChange }
}

describe('キーボードナビゲーション', () => {
  it('ArrowDown で open になり先頭アイテムがハイライトされる', async () => {
    const user = userEvent.setup()
    setup()
    screen.getByRole('button').focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toHaveAttribute('data-highlighted')
  })

  it('ArrowUp で open になり末尾アイテムがハイライトされる', async () => {
    const user = userEvent.setup()
    setup()
    screen.getByRole('button').focus()
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByText('Lemon')).toHaveAttribute('data-highlighted')
  })

  it('ArrowDown で次のアイテムに移動する', async () => {
    const user = userEvent.setup()
    setup()
    screen.getByRole('button').focus()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowDown}')
    expect(screen.getByText('Banana')).toHaveAttribute('data-highlighted')
    expect(screen.getByText('Apple')).not.toHaveAttribute('data-highlighted')
  })

  it('disabled アイテムをスキップする', async () => {
    const user = userEvent.setup()
    setup()
    screen.getByRole('button').focus()
    await user.keyboard('{ArrowDown}')  // Apple
    await user.keyboard('{ArrowDown}')  // Banana
    await user.keyboard('{ArrowDown}')  // Cherry はスキップ → Lemon
    expect(screen.getByText('Lemon')).toHaveAttribute('data-highlighted')
  })

  it('ArrowDown が末尾でループして先頭に戻る', async () => {
    const user = userEvent.setup()
    setup()
    screen.getByRole('button').focus()
    await user.keyboard('{ArrowDown}')  // Apple
    await user.keyboard('{ArrowDown}')  // Banana
    await user.keyboard('{ArrowDown}')  // Lemon
    await user.keyboard('{ArrowDown}')  // Apple (ループ)
    expect(screen.getByText('Apple')).toHaveAttribute('data-highlighted')
  })

  it('ArrowUp で前のアイテムに移動する', async () => {
    const user = userEvent.setup()
    setup()
    screen.getByRole('button').focus()
    await user.keyboard('{ArrowDown}')  // Apple
    await user.keyboard('{ArrowDown}')  // Banana
    await user.keyboard('{ArrowUp}')    // Apple
    expect(screen.getByText('Apple')).toHaveAttribute('data-highlighted')
  })

  it('Enter でハイライト中のアイテムを選択する', async () => {
    const user = userEvent.setup()
    const { onValueChange } = setup()
    screen.getByRole('button').focus()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')
    expect(onValueChange).toHaveBeenCalledWith('apple')
  })

  it('Escape 後に再度開くと先頭からハイライトされる', async () => {
    const user = userEvent.setup()
    setup()
    screen.getByRole('button').focus()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowDown}')  // Banana
    await user.keyboard('{Escape}')
    await user.keyboard('{ArrowDown}')  // 再度 open → Apple
    expect(screen.getByText('Apple')).toHaveAttribute('data-highlighted')
  })
})
