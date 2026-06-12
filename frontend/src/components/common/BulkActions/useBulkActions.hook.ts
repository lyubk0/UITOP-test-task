import { useCallback, useState } from 'react';
import type { Todo } from '@/types/todo.type';

interface UseBulkActionsProps {
  todos: Todo[];
  onBulkComplete: (todos: Todo[]) => void;
}

export function useBulkActions({ todos, onBulkComplete }: UseBulkActionsProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    const activeTodos = todos.filter((t) => !t.completed);
    setSelectedIds((prev) =>
      prev.size === activeTodos.length
        ? new Set()
        : new Set(activeTodos.map((t) => t.id)),
    );
  }, [todos]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const handleBulkComplete = useCallback(() => {
    const selected = todos.filter((t) => selectedIds.has(t.id) && !t.completed);
    if (selected.length === 0) return;
    onBulkComplete(selected);
    setSelectedIds(new Set());
  }, [todos, selectedIds, onBulkComplete]);

  const activeTodos = todos.filter((t) => !t.completed);
  const allSelected = activeTodos.length > 0 && selectedIds.size === activeTodos.length;
  const someSelected = selectedIds.size > 0;

  return {
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    handleBulkComplete,
    allSelected,
    someSelected,
  };
}
