import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({})),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaService } = require('../prisma/prisma.service') as {
  PrismaService: jest.MockedClass<{ new (): Record<string, unknown> }>;
};

const makeTodo = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  text: 'Test',
  completed: false,
  categoryId: 1,
  createdAt: new Date(),
  category: { id: 1, name: 'Work' },
  ...overrides,
});

const mockPrisma = {
  todo: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(async () => {
    PrismaService.mockImplementation(() => mockPrisma as unknown as InstanceType<typeof PrismaService>);

    const module: TestingModule = await Test.createTestingModule({
      providers: [TodosService, PrismaService],
    }).compile();

    service = module.get<TodosService>(TodosService);
    jest.clearAllMocks();
  });

  describe('create — 5-per-category rule', () => {
    it('creates a todo when category has fewer than 5 active tasks', async () => {
      mockPrisma.todo.count.mockResolvedValue(4);
      mockPrisma.todo.create.mockResolvedValue(makeTodo());

      const result = await service.create({ text: 'New task', categoryId: 1 });

      expect(mockPrisma.todo.count).toHaveBeenCalledWith({
        where: { categoryId: 1, completed: false },
      });
      expect(mockPrisma.todo.create).toHaveBeenCalled();
      expect(result).toMatchObject({ text: 'Test' });
    });

    it('throws BadRequestException when category already has 5 active tasks', async () => {
      mockPrisma.todo.count.mockResolvedValue(5);

      await expect(service.create({ text: 'Sixth task', categoryId: 1 })).rejects.toThrow(
        BadRequestException,
      );
      expect(mockPrisma.todo.create).not.toHaveBeenCalled();
    });

    it('throws with a descriptive message at the limit', async () => {
      mockPrisma.todo.count.mockResolvedValue(5);

      await expect(service.create({ text: 'Over limit', categoryId: 1 })).rejects.toThrow(
        'This category already has 5 active tasks',
      );
    });

    it('counts only non-completed tasks towards the limit', async () => {
      mockPrisma.todo.count.mockResolvedValue(3);
      mockPrisma.todo.create.mockResolvedValue(makeTodo());

      await service.create({ text: 'Task', categoryId: 1 });

      expect(mockPrisma.todo.count).toHaveBeenCalledWith({
        where: { categoryId: 1, completed: false },
      });
    });
  });

  describe('update', () => {
    it('updates an existing todo', async () => {
      mockPrisma.todo.findUnique.mockResolvedValue(makeTodo());
      mockPrisma.todo.update.mockResolvedValue(makeTodo({ completed: true }));

      const result = await service.update(1, { completed: true });

      expect(result.completed).toBe(true);
    });

    it('throws NotFoundException for a missing todo', async () => {
      mockPrisma.todo.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { completed: true })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes an existing todo', async () => {
      mockPrisma.todo.findUnique.mockResolvedValue(makeTodo());
      mockPrisma.todo.delete.mockResolvedValue(makeTodo());

      await service.remove(1);

      expect(mockPrisma.todo.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('throws NotFoundException when deleting a missing todo', async () => {
      mockPrisma.todo.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
