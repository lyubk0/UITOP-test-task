import type { Todo } from '@/types/todo.type';

interface UseTodoItemProps {
  todo: Todo;
  isPending: boolean;
  onComplete: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function useTodoItem({ todo, isPending, onComplete, onDelete }: UseTodoItemProps) {
  const handleComplete = () => {
    if (!isPending) {
      onComplete(todo);
    }
  };

  const handleDelete = () => {
    if (!isPending) {
      onDelete(todo);
    }
  };

  return { handleComplete, handleDelete };
}
