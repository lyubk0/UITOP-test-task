import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import type { Category } from '@/types/category.type';
import type { Todo } from '@/types/todo.type';
import { Plus } from 'lucide-react';
import { useCreateTodoForm } from './useCreateTodoForm.hook';

interface CreateTodoFormProps {
  categories: Category[];
  onCreated: (todo: Todo) => void;
}

export default function CreateTodoForm({ categories, onCreated }: CreateTodoFormProps) {
  const { form, onSubmit } = useCreateTodoForm({ onCreated });
  const { register, setValue, watch, formState: { errors, isSubmitting } } = form;

  const categoryId = watch('categoryId');
  const selectedCategoryName = categoryId
    ? categories.find((c) => String(c.id) === categoryId)?.name
    : undefined;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex flex-col gap-1">
          <Label htmlFor="task-text">Task</Label>
          <Input
            id="task-text"
            placeholder="What needs to be done?"
            {...register('text', { required: 'Task text is required' })}
          />
          {errors.text && (
            <p className="text-xs text-destructive">{errors.text.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 sm:w-48">
          <Label htmlFor="task-category">Category</Label>
          <Select
            value={categoryId}
            onValueChange={(v) => setValue('categoryId', v ?? '', { shouldValidate: true })}
          >
            <SelectTrigger id="task-category">
              <SelectValue placeholder="Select category">
                {selectedCategoryName}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-xs text-destructive">{errors.categoryId.message}</p>
          )}
          <input
            type="hidden"
            {...register('categoryId', { required: 'Category is required' })}
          />
        </div>

        <div className="flex items-end">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto gap-2">
            <Plus className="h-4 w-4" />
            Add task
          </Button>
        </div>
      </div>

      {errors.root && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
          {errors.root.message}
        </p>
      )}
    </form>
  );
}
