/**
 * Todo item list with status indicators.
 * Displays pending, in_progress, completed, and skipped items.
 */

interface TodoItem {
  id: string;
  text: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
}

interface TodoListProps {
  todos: TodoItem[];
}

const STATUS_INDICATORS: Record<string, { icon: string; textColor: string }> = {
  pending: {
    icon: '\u25CB',  // empty circle
    textColor: 'text-white/50',
  },
  in_progress: {
    icon: '\u25D4',  // half circle
    textColor: 'text-cyan-400',
  },
  completed: {
    icon: '\u2713',  // checkmark
    textColor: 'text-emerald-400',
  },
  skipped: {
    icon: '\u2212',  // minus
    textColor: 'text-white/30',
  },
};

const DEFAULT_INDICATOR = {
  icon: '?',
  textColor: 'text-white/40',
};

export default function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="text-sm text-white/40 font-mono">No todo items</p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {todos.map((todo) => {
        const indicator = STATUS_INDICATORS[todo.status] ?? DEFAULT_INDICATOR;
        return (
          <li key={todo.id} className="flex items-start gap-2 text-sm">
            <span
              className={`font-mono text-base leading-5 ${indicator.textColor}`}
              title={todo.status}
            >
              {indicator.icon}
            </span>
            <span
              className={`font-mono ${
                todo.status === 'completed'
                  ? 'text-white/60 line-through'
                  : todo.status === 'skipped'
                    ? 'text-white/30 line-through'
                    : 'text-white/80'
              }`}
            >
              {todo.text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
