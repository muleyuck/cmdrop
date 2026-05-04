import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from '../../src/dropdown/Dropdown'
import { Trigger } from '../../src/dropdown/Trigger'
import { Content } from '../../src/dropdown/Content'
import { Item } from '../../src/dropdown/Item'

function renderDropdown(props: Parameters<typeof Dropdown>[0] = {}) {
  return render(
    <Dropdown {...props}>
      <Trigger>Open</Trigger>
      <Content>
        <Item value="apple">Apple</Item>
        <Item value="banana">Banana</Item>
        <Item value="cherry" disabled>Cherry</Item>
      </Content>
    </Dropdown>,
  )
}

describe('Dropdown.Item', () => {
  it('role=option でレンダリングされる', async () => {
    const user = userEvent.setup()
    renderDropdown()
    await user.click(screen.getByRole('button'))
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('クリックで単一選択され onValueChange が呼ばれる', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderDropdown({ onValueChange })
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Apple'))
    expect(onValueChange).toHaveBeenCalledWith('apple')
  })

  it('単一選択後に Content が閉じる', async () => {
    const user = userEvent.setup()
    renderDropdown()
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Apple'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('disabled なアイテムはクリックしても選択されない', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderDropdown({ onValueChange })
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Cherry'))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('disabled アイテムが aria-disabled と data-disabled を持つ', async () => {
    const user = userEvent.setup()
    renderDropdown()
    await user.click(screen.getByRole('button'))
    const cherry = screen.getByText('Cherry')
    expect(cherry).toHaveAttribute('aria-disabled', 'true')
    expect(cherry).toHaveAttribute('data-disabled')
  })

  it('選択済みアイテムが aria-selected=true と data-selected を持つ', async () => {
    const user = userEvent.setup()
    renderDropdown({ value: 'apple' })
    await user.click(screen.getByRole('button'))
    const apple = screen.getByText('Apple')
    expect(apple).toHaveAttribute('aria-selected', 'true')
    expect(apple).toHaveAttribute('data-selected')
  })

  it('未選択アイテムが aria-selected=false を持つ', async () => {
    const user = userEvent.setup()
    renderDropdown()
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Apple')).toHaveAttribute('aria-selected', 'false')
  })

  it('複数選択: クリックで追加される', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Dropdown multiple onValueChange={onValueChange}>
        <Trigger>Open</Trigger>
        <Content>
          <Item value="apple">Apple</Item>
          <Item value="banana">Banana</Item>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Apple'))
    expect(onValueChange).toHaveBeenCalledWith(['apple'])
  })

  it('複数選択: 再クリックで解除される', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Dropdown multiple value={['apple']} onValueChange={onValueChange}>
        <Trigger>Open</Trigger>
        <Content>
          <Item value="apple">Apple</Item>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Apple'))
    expect(onValueChange).toHaveBeenCalledWith([])
  })

  it('複数選択後に Content が閉じない', async () => {
    const user = userEvent.setup()
    render(
      <Dropdown multiple>
        <Trigger>Open</Trigger>
        <Content>
          <Item value="apple">Apple</Item>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Apple'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('複数選択: 複数アイテムを順に追加できる', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Dropdown multiple onValueChange={onValueChange}>
        <Trigger>Open</Trigger>
        <Content>
          <Item value="apple">Apple</Item>
          <Item value="banana">Banana</Item>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Apple'))
    await user.click(screen.getByText('Banana'))
    expect(onValueChange).toHaveBeenLastCalledWith(expect.arrayContaining(['apple', 'banana']))
  })

  it('複数選択: クリック後に data-selected が付く (uncontrolled)', async () => {
    const user = userEvent.setup()
    render(
      <Dropdown multiple>
        <Trigger>Open</Trigger>
        <Content>
          <Item value="apple">Apple</Item>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Apple'))
    expect(screen.getByText('Apple')).toHaveAttribute('data-selected')
  })

  it('disabled アイテムに外部 onClick を渡しても呼ばれない', async () => {
    const user = userEvent.setup()
    const externalOnClick = vi.fn()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>
          <Item value="cherry" disabled onClick={externalOnClick}>Cherry</Item>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Cherry'))
    expect(externalOnClick).not.toHaveBeenCalled()
  })
})
