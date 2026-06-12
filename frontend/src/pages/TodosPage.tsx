import BulkActions from '@/components/common/BulkActions/BulkActions'
import CategoryFilter from '@/components/common/CategoryFilter'
import CreateTodoForm from '@/components/common/CreateTodoForm/CreateTodoForm'
import Spinner from '@/components/common/Spinner'
import TodoList from '@/components/common/TodoList/TodoList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useTodosPage } from './useTodosPage.hook'

export default function TodosPage() {
	const {
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
	} = useTodosPage()

	return (
		<div className='mx-auto max-w-3xl px-4 py-10'>
			<div className='mb-8 flex items-center gap-3'>
				<h1 className='text-3xl font-bold tracking-tight'>Todo List</h1>
			</div>

			<Card className='mb-6'>
				<CardHeader>
					<CardTitle className='text-base'>Add a new task</CardTitle>
				</CardHeader>
				<CardContent>
					<CreateTodoForm categories={categories} onCreated={handleCreated} />
				</CardContent>
			</Card>

			<div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<CategoryFilter
					categories={categories}
					value={selectedCategory}
					onChange={setSelectedCategory}
				/>

				<BulkActions
					allSelected={bulkActions.allSelected}
					someSelected={bulkActions.someSelected}
					selectedCount={bulkActions.selectedIds.size}
					onToggleSelectAll={bulkActions.toggleSelectAll}
					onBulkComplete={bulkActions.handleBulkComplete}
				/>
			</div>

			{loading && <Spinner />}

			{!loading && error && (
				<div className='rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive'>
					{error}
				</div>
			)}

			{!loading && !error && (
				<TodoList
					todos={todos}
					pendingIds={pendingIds}
					selectedIds={bulkActions.selectedIds}
					onComplete={handleComplete}
					onDelete={handleDelete}
					onToggleSelect={bulkActions.toggleSelect}
				/>
			)}
		</div>
	)
}
