import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from '../../src/dropdown/Dropdown'
import { Trigger } from '../../src/dropdown/Trigger'
import { Content } from '../../src/dropdown/Content'
import { Item } from '../../src/dropdown/Item'
import { Group } from '../../src/dropdown/Group'
import { Separator } from '../../src/dropdown/Separator'
import { Empty } from '../../src/dropdown/Empty'

describe('Dropdown.Group', () => {
  it('role=group と data-cmdrop-group でレンダリングされる', async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>
          <Group label="Fruits">
            <Item value="apple">Apple</Item>
          </Group>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('group')).toHaveAttribute('data-cmdrop-group')
  })

  it('label があれば aria-labelledby でラベルを参照する', async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>
          <Group label="Fruits">
            <Item value="apple">Apple</Item>
          </Group>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole('button'))
    const group = screen.getByRole('group')
    const label = screen.getByText('Fruits')
    expect(label).toHaveAttribute('data-cmdrop-group-label')
    expect(group).toHaveAttribute('aria-labelledby', label.id)
  })

  it('label がなければ aria-labelledby を持たない', async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>
          <Group>
            <Item value="apple">Apple</Item>
          </Group>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('group')).not.toHaveAttribute('aria-labelledby')
  })
})

describe('Dropdown.Separator', () => {
  it('role=separator と data-cmdrop-separator でレンダリングされる', async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>
          <Item value="a">A</Item>
          <Separator />
          <Item value="b">B</Item>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('separator')).toHaveAttribute('data-cmdrop-separator')
  })
})

describe('Dropdown.Empty', () => {
  it('data-cmdrop-empty と aria-live=polite を持つ', async () => {
    const user = userEvent.setup()
    render(
      <Dropdown>
        <Trigger>Open</Trigger>
        <Content>
          <Empty>No results</Empty>
        </Content>
      </Dropdown>,
    )
    await user.click(screen.getByRole('button'))
    const empty = screen.getByText('No results')
    expect(empty).toHaveAttribute('data-cmdrop-empty')
    expect(empty).toHaveAttribute('aria-live', 'polite')
  })
})
