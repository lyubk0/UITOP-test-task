import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import type { Category } from '@/types/category.type';

interface CategoryFilterProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
}

export default function CategoryFilter({ categories, value, onChange }: CategoryFilterProps) {
  const label =
    value === 'all'
      ? 'All categories'
      : (categories.find((c) => c.name === value)?.name ?? value);

  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? 'all')}>
      <SelectTrigger className="w-48">
        <SelectValue>{label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All categories</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.name}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
