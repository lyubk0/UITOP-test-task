import { httpClient } from '../api/http.client'
import type { Category } from '../types/category.type'

export const getAll = async (): Promise<Category[]> => {
	const { data } = await httpClient.get<Category[]>('/categories')

	return data
}
