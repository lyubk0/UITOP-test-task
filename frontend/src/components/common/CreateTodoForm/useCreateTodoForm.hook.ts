import { apiClient } from '@/api/api-client'
import { getErrorMessage } from '@/lib/getErrorMessage.util'
import type { Todo } from '@/types/todo.type'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface FormValues {
	text: string
	categoryId: string
}

interface UseCreateTodoFormProps {
	onCreated: (todo: Todo) => void
}

export function useCreateTodoForm({ onCreated }: UseCreateTodoFormProps) {
	const form = useForm<FormValues>({
		defaultValues: { text: '', categoryId: '' },
	})

	const onSubmit = form.handleSubmit(async values => {
		try {
			const todo = await apiClient.todos.create({
				text: values.text.trim(),
				categoryId: Number(values.categoryId),
			})
			onCreated(todo)
			form.reset()
			toast.success('Task created!')
		} catch (err) {
			const msg = getErrorMessage(err)
			form.setError('root', { message: msg })
		}
	})

	return { form, onSubmit }
}
