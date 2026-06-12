import CreateTodoForm from '@/components/common/CreateTodoForm/CreateTodoForm'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toaster } from 'react-hot-toast'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/api/api-client', () => ({
	apiClient: {
		todos: {
			create: vi.fn(),
		},
	},
}))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { apiClient } = await import('@/api/api-client')

const mockCategories = [
	{ id: 1, name: 'Work' },
	{ id: 2, name: 'Personal' },
]

const mockTodo = {
	id: 1,
	text: 'Buy groceries',
	completed: false,
	categoryId: 2,
	createdAt: new Date().toISOString(),
	category: { id: 2, name: 'Personal' },
}

function renderForm(onCreated = vi.fn()) {
	return render(
		<>
			<Toaster />
			<CreateTodoForm categories={mockCategories} onCreated={onCreated} />
		</>,
	)
}

describe('CreateTodoForm', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders the text input and category select', () => {
		renderForm()
		expect(
			screen.getByPlaceholderText('What needs to be done?'),
		).toBeInTheDocument()
		expect(screen.getByText('Select category')).toBeInTheDocument()
	})

	it('shows a validation error when submitting with an empty text field', async () => {
		const user = userEvent.setup()
		renderForm()

		await user.click(screen.getByRole('button', { name: /add task/i }))

		await waitFor(() => {
			expect(screen.getByText('Task text is required')).toBeInTheDocument()
		})
		expect(apiClient.todos.create).not.toHaveBeenCalled()
	})

	it('shows a validation error when no category is selected', async () => {
		const user = userEvent.setup()
		renderForm()

		await user.type(
			screen.getByPlaceholderText('What needs to be done?'),
			'Buy groceries',
		)
		await user.click(screen.getByRole('button', { name: /add task/i }))

		await waitFor(() => {
			expect(screen.getByText('Category is required')).toBeInTheDocument()
		})
		expect(apiClient.todos.create).not.toHaveBeenCalled()
	})

	it('calls onCreated and resets the form on successful submit', async () => {
		const user = userEvent.setup()
		const onCreated = vi.fn()
		vi.mocked(apiClient.todos.create).mockResolvedValue(mockTodo)

		renderForm(onCreated)

		await user.type(
			screen.getByPlaceholderText('What needs to be done?'),
			'Buy groceries',
		)

		await user.click(screen.getByRole('combobox'))
		await user.click(screen.getByText('Personal'))

		await user.click(screen.getByRole('button', { name: /add task/i }))

		await waitFor(() => {
			expect(apiClient.todos.create).toHaveBeenCalledWith({
				text: 'Buy groceries',
				categoryId: 2,
			})
			expect(onCreated).toHaveBeenCalledWith(mockTodo)
		})

		expect(screen.getByPlaceholderText('What needs to be done?')).toHaveValue(
			'',
		)
	})

	it('shows the API error message when the backend returns a 400', async () => {
		const user = userEvent.setup()
		vi.mocked(apiClient.todos.create).mockRejectedValue({
			isAxiosError: true,
			response: {
				data: { message: 'This category already has 5 active tasks' },
			},
			message: 'Request failed',
		})

		renderForm()

		await user.type(
			screen.getByPlaceholderText('What needs to be done?'),
			'One more task',
		)

		await user.click(screen.getByRole('combobox'))
		await user.click(screen.getByText('Work'))

		await user.click(screen.getByRole('button', { name: /add task/i }))

		await waitFor(() => {
			expect(
				screen.getByText('This category already has 5 active tasks'),
			).toBeInTheDocument()
		})
	})
})
