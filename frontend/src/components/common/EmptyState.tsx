import { ClipboardList } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <ClipboardList className="h-12 w-12 opacity-40" />
      <p className="text-lg font-medium">No tasks yet</p>
      <p className="text-sm">Add a task above to get started.</p>
    </div>
  );
}
