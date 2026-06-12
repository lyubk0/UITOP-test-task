import { useBulkActions } from '@/components/common/BulkActions/useBulkActions.hook'
import { useCategories } from '@/hooks/useCategories.hook'
import { useTodos } from '@/hooks/useTodos.hook'
import { useState } from 'react'
import { useTodoActions } from './useTodoActions.hook'

export function useTodosPage() {
	const [selectedCategory, setSelectedCategory] = useState('all')
	const categoryParam =
		selectedCategory === 'all' ? undefined : selectedCategory

	const { todos, setTodos, loading, error, refetch } = useTodos(categoryParam)
	const { categories } = useCategories()

	const {
		handleComplete,
		handleDelete,
		handleCreated,
		handleBulkComplete,
		pendingIds,
	} = useTodoActions({ setTodos, refetch })

	const bulkActions = useBulkActions({
		todos,
		onBulkComplete: handleBulkComplete,
	})

	return {
		todos,
		loading,
		error,
		categories,
		selectedCategory,
		setSelectedCategory,
		pendingIds,
		handleComplete,
		handleDelete,
		handleCreated,
		bulkActions,
	}
}
