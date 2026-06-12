interface UndoToastProps {
  message: string;
  onUndo: () => void;
}

export default function UndoToast({ message, onUndo }: UndoToastProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">{message}</span>
      <button
        onClick={onUndo}
        className="shrink-0 rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
      >
        Undo
      </button>
    </div>
  );
}
