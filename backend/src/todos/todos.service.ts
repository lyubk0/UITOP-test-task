import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'

const MAX_ACTIVE_TASKS_PER_CATEGORY = 5

@Injectable()
export class TodosService {
	constructor(private readonly prisma: PrismaService) {}

	findAll(category?: string) {
		return this.prisma.todo.findMany({
			where: category ? { category: { name: category } } : undefined,
			include: { category: true },
			orderBy: { createdAt: 'desc' },
		})
	}

	async create(dto: CreateTodoDto) {
		const activeCount = await this.prisma.todo.count({
			where: { categoryId: dto.categoryId, completed: false },
		})

		if (activeCount >= MAX_ACTIVE_TASKS_PER_CATEGORY) {
			throw new BadRequestException(
				'This category already has 5 active tasks. Complete or delete existing tasks before adding more.',
			)
		}

		return this.prisma.todo.create({
			data: { text: dto.text, categoryId: dto.categoryId },
			include: { category: true },
		})
	}

	async update(id: number, dto: UpdateTodoDto) {
		await this.findOneOrFail(id)
		return this.prisma.todo.update({
			where: { id },
			data: dto,
			include: { category: true },
		})
	}

	async remove(id: number) {
		await this.findOneOrFail(id)
		return this.prisma.todo.delete({ where: { id } })
	}

	private async findOneOrFail(id: number) {
		const todo = await this.prisma.todo.findUnique({ where: { id } })
		if (!todo) throw new NotFoundException(`Todo #${id} not found`)
		return todo
	}
}
