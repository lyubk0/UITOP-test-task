import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import { CheckCheck } from 'lucide-react';

interface BulkActionsProps {
  allSelected: boolean;
  someSelected: boolean;
  selectedCount: number;
  onToggleSelectAll: () => void;
  onBulkComplete: () => void;
}

export default function BulkActions({
  allSelected,
  someSelected,
  selectedCount,
  onToggleSelectAll,
  onBulkComplete,
}: BulkActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="select-all"
          checked={allSelected}
          onCheckedChange={onToggleSelectAll}
          aria-label="Select all tasks"
        />
        <Label htmlFor="select-all" className="text-sm cursor-pointer select-none">
          Select all
        </Label>
      </div>

      {someSelected && (
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkComplete}
          className="gap-2 text-green-700 border-green-300 hover:bg-green-50 hover:text-green-800"
        >
          <CheckCheck className="h-4 w-4" />
          Mark {selectedCount} done
        </Button>
      )}
    </div>
  );
}
