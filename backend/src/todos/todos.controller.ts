import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { TodosService } from './todos.service'

@Controller('todos')
export class TodosController {
	constructor(private readonly todosService: TodosService) {}

	@Get()
	findAll(@Query('category') category?: string) {
		return this.todosService.findAll(category)
	}

	@Post()
	create(@Body() dto: CreateTodoDto) {
		return this.todosService.create(dto)
	}

	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTodoDto) {
		return this.todosService.update(id, dto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.todosService.remove(id)
	}
}
