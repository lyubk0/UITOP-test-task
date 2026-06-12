import { useEffect, useState } from 'react'
import { apiClient } from '../api/api-client'
import { getErrorMessage } from '../lib/getErrorMessage.util'
import type { Category } from '../types/category.type'

export function useCategories() {
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		apiClient.categories
			.getAll()
			.then(setCategories)
			.catch(err => setError(getErrorMessage(err)))
			.finally(() => setLoading(false))
	}, [])

	return { categories, loading, error }
}
