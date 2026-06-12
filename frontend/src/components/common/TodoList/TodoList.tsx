import type { Todo } from '@/types/todo.type'
import EmptyState from '../EmptyState'
import TodoItem from '../TodoItem/TodoItem'

interface TodoListProps {
	todos: Todo[]
	pendingIds: Set<number>
	selectedIds: Set<number>
	onComplete: (todo: Todo) => void
	onDelete: (todo: Todo) => void
	onToggleSelect: (id: number) => void
}

export default function TodoList({
	todos,
	pendingIds,
	selectedIds,
	onComplete,
	onDelete,
	onToggleSelect,
}: TodoListProps) {
	if (todos.length === 0) return <EmptyState />

	return (
		<div className='flex flex-col gap-2'>
			{todos.map(todo => (
				<TodoItem
					key={todo.id}
					todo={todo}
					isPending={pendingIds.has(todo.id)}
					isSelected={selectedIds.has(todo.id)}
					onComplete={onComplete}
					onDelete={onDelete}
					onToggleSelect={onToggleSelect}
				/>
			))}
		</div>
	)
}
