import { httpClient } from '../api/http.client'
import type { Todo } from '../types/todo.type'

export interface CreateTodoPayload {
	text: string
	categoryId: number
}

export interface UpdateTodoPayload {
	completed: boolean
}

export const getAll = async (category?: string): Promise<Todo[]> => {
	const { data } = await httpClient.get<Todo[]>('/todos', {
		params: category ? { category } : undefined,
	})
	return data
}

export const create = async (payload: CreateTodoPayload): Promise<Todo> => {
	const { data } = await httpClient.post<Todo>('/todos', payload)
	return data
}

export const update = async (
	id: number,
	payload: UpdateTodoPayload,
): Promise<Todo> => {
	const { data } = await httpClient.patch<Todo>(`/todos/${id}`, payload)
	return data
}

export const remove = async (id: number): Promise<void> => {
	await httpClient.delete(`/todos/${id}`)
}
