import type { Category } from './category.type';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  categoryId: number;
  category: Category;
}
