import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '../api/api-client'
import { getErrorMessage } from '../lib/getErrorMessage.util'
import type { Todo } from '../types/todo.type'

export function useTodos(category?: string) {
	const [todos, setTodos] = useState<Todo[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchTodos = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const data = await apiClient.todos.getAll(category)
			setTodos(data)
		} catch (err) {
			setError(getErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}, [category])

	useEffect(() => {
		fetchTodos()
	}, [fetchTodos])

	return { todos, setTodos, loading, error, refetch: fetchTodos }
}
