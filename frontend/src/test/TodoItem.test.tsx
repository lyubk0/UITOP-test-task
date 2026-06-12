import TodoItem from '@/components/common/TodoItem/TodoItem'
import type { Todo } from '@/types/todo.type'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

const FIXED_DATE = '2026-01-01T00:00:00.000Z'

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
	id: 1,
	text: 'Test task',
	completed: false,
	createdAt: FIXED_DATE,
	categoryId: 1,
	category: { id: 1, name: 'Work' },
	...overrides,
})

function renderItem({
	todo = makeTodo(),
	isPending = false,
	isSelected = false,
	onComplete = vi.fn(),
	onDelete = vi.fn(),
	onToggleSelect = vi.fn(),
} = {}) {
	return render(
		<TodoItem
			todo={todo}
			isPending={isPending}
			isSelected={isSelected}
			onComplete={onComplete}
			onDelete={onDelete}
			onToggleSelect={onToggleSelect}
		/>,
	)
}

describe('TodoItem', () => {
	it('renders the todo text and category badge', () => {
		renderItem()
		expect(screen.getByText('Test task')).toBeInTheDocument()
		expect(screen.getByText('Work')).toBeInTheDocument()
	})

	it('calls onComplete when the done checkbox is clicked', async () => {
		const user = userEvent.setup()
		const onComplete = vi.fn()
		renderItem({ onComplete })

		await user.click(screen.getByRole('checkbox', { name: /mark as done/i }))

		expect(onComplete).toHaveBeenCalledWith(makeTodo())
	})

	it('calls onDelete when the delete button is clicked', async () => {
		const user = userEvent.setup()
		const onDelete = vi.fn()
		renderItem({ onDelete })

		await user.click(screen.getByRole('button', { name: /delete task/i }))

		expect(onDelete).toHaveBeenCalledWith(makeTodo())
	})

	it('calls onToggleSelect when the select checkbox is clicked', async () => {
		const user = userEvent.setup()
		const onToggleSelect = vi.fn()
		renderItem({ onToggleSelect })

		await user.click(screen.getByRole('checkbox', { name: /select task/i }))

		expect(onToggleSelect).toHaveBeenCalledWith(1)
	})

	it('marks the done checkbox as disabled when isPending is true', () => {
		renderItem({ isPending: true })

		const doneCheckbox = screen.getByRole('checkbox', { name: /mark as done/i })
		expect(doneCheckbox).toHaveAttribute('data-disabled')
	})

	it('calls onComplete when clicking a completed todo (toggle uncomplete)', async () => {
		const user = userEvent.setup()
		const onComplete = vi.fn()
		renderItem({ todo: makeTodo({ completed: true }), onComplete })

		const doneCheckbox = screen.getByRole('checkbox', { name: /mark as done/i })
		expect(doneCheckbox).not.toHaveAttribute('data-disabled')
		await user.click(doneCheckbox)

		expect(onComplete).toHaveBeenCalledTimes(1)
	})

	it('disables the delete button when isPending is true (undo in flight)', () => {
		renderItem({ isPending: true })

		const deleteBtn = screen.getByRole('button', { name: /delete task/i })
		expect(deleteBtn).toBeDisabled()
	})

	it('applies line-through styling when todo is completed', () => {
		renderItem({ todo: makeTodo({ completed: true }) })
		const text = screen.getByText('Test task')
		expect(text).toHaveClass('line-through')
	})

	it('shows a checked done-checkbox when todo is already completed', () => {
		renderItem({ todo: makeTodo({ completed: true }) })
		const doneCheckbox = screen.getByRole('checkbox', { name: /mark as done/i })
		expect(doneCheckbox).toHaveAttribute('aria-checked', 'true')
	})
})
