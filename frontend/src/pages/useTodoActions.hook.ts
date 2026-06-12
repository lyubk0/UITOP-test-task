import { apiClient } from '@/api/api-client'
import { getErrorMessage } from '@/lib/getErrorMessage.util.ts'
import type { Todo } from '@/types/todo.type'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useUndoFlow } from './useUndoFlow.hook.tsx'

interface UseTodoActionsProps {
	setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
	refetch: () => void
}

export function useTodoActions({ setTodos, refetch }: UseTodoActionsProps) {
	const { schedule, pendingIds } = useUndoFlow()

	const handleToggleComplete = useCallback(
		(todo: Todo) => {
			const newCompleted = !todo.completed

			setTodos(prev =>
				prev.map(t =>
					t.id === todo.id ? { ...t, completed: newCompleted } : t,
				),
			)

			const message = newCompleted
				? `"${todo.text}" marked as done`
				: `"${todo.text}" marked as active`

			schedule(
				todo.id,
				message,
				async () => {
					try {
						await apiClient.todos.update(todo.id, { completed: newCompleted })
					} catch (err) {
						toast.error(getErrorMessage(err))
						refetch()
					}
				},
				() => {
					setTodos(prev =>
						prev.map(t =>
							t.id === todo.id ? { ...t, completed: todo.completed } : t,
						),
					)
				},
			)
		},
		[setTodos, schedule, refetch],
	)

	const handleDelete = useCallback(
		(todo: Todo) => {
			setTodos(prev => prev.filter(t => t.id !== todo.id))

			schedule(
				todo.id,
				`"${todo.text}" deleted`,
				async () => {
					try {
						await apiClient.todos.remove(todo.id)
					} catch (err) {
						toast.error(getErrorMessage(err))
						refetch()
					}
				},
				() => {
					setTodos(prev => {
						const alreadyPresent = prev.some(t => t.id === todo.id)
						return alreadyPresent ? prev : [todo, ...prev]
					})
				},
			)
		},
		[setTodos, schedule, refetch],
	)

	const handleCreated = useCallback(
		(todo: Todo) => {
			setTodos(prev => [todo, ...prev])
		},
		[setTodos],
	)

	const handleBulkComplete = useCallback(
		(selected: Todo[]) => {
			selected.forEach(todo => handleToggleComplete(todo))
		},
		[handleToggleComplete],
	)

	return {
		handleComplete: handleToggleComplete,
		handleDelete,
		handleCreated,
		handleBulkComplete,
		pendingIds,
	}
}
