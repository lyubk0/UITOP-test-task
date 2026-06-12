import * as categoriesService from '../services/categories.service'
import * as todosService from '../services/todos.service'

export const apiClient = {
	todos: todosService,
	categories: categoriesService,
}
