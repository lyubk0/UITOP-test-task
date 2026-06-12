import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { cn } from '@/lib/utils';
import type { Todo } from '@/types/todo.type';
import { Trash2 } from 'lucide-react';
import { useTodoItem } from './useTodoItem.hook';

interface TodoItemProps {
  todo: Todo;
  isPending: boolean;
  isSelected: boolean;
  onComplete: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onToggleSelect: (id: number) => void;
}

export default function TodoItem({
  todo,
  isPending,
  isSelected,
  onComplete,
  onDelete,
  onToggleSelect,
}: TodoItemProps) {
  const { handleComplete, handleDelete } = useTodoItem({
    todo,
    isPending,
    onComplete,
    onDelete,
  });

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-opacity',
        isPending && 'opacity-50',
      )}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleSelect(todo.id)}
        aria-label="Select task"
      />

      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleComplete}
        disabled={isPending}
        aria-label="Mark as done"
        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
      />

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm truncate',
            todo.completed && 'line-through text-muted-foreground',
          )}
        >
          {todo.text}
        </p>
      </div>

      <Badge variant="secondary" className="shrink-0 text-xs">
        {todo.category.name}
      </Badge>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Delete task"
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
